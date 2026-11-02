package com.irvin.pos.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.irvin.pos.dtos.ShiftDTO;
import com.irvin.pos.dtos.ShiftReportDTO;
import com.irvin.pos.dtos.ShiftRequestsDTO;
import com.irvin.pos.entities.CashRegister;
import com.irvin.pos.entities.Payment;
import com.irvin.pos.entities.PaymentMethod;
import com.irvin.pos.entities.Refund;
import com.irvin.pos.entities.Sale;
import com.irvin.pos.entities.SaleStatus;
import com.irvin.pos.entities.Shift;
import com.irvin.pos.entities.ShiftStatus;
import com.irvin.pos.entities.Transaction;
import com.irvin.pos.entities.TransactionType;
import com.irvin.pos.entities.UserAccount;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.repositories.CashRegisterRepository;
import com.irvin.pos.repositories.RefundRepository;
import com.irvin.pos.repositories.SaleRepository;
import com.irvin.pos.repositories.ShiftRepository;
import com.irvin.pos.repositories.TransactionRepository;

/**
 * Register shifts: open with a counted float, record every cash movement, close by counting the drawer.
 */
@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final CashRegisterRepository cashRegisterRepository;
    private final TransactionRepository transactionRepository;
    private final SaleRepository saleRepository;
    private final RefundRepository refundRepository;
    private final CurrentUserService currentUserService;

    public ShiftService(ShiftRepository shiftRepository, CashRegisterRepository cashRegisterRepository,
            TransactionRepository transactionRepository, SaleRepository saleRepository,
            RefundRepository refundRepository, CurrentUserService currentUserService) {
        this.shiftRepository = shiftRepository;
        this.cashRegisterRepository = cashRegisterRepository;
        this.transactionRepository = transactionRepository;
        this.saleRepository = saleRepository;
        this.refundRepository = refundRepository;
        this.currentUserService = currentUserService;
    }

    /**
     * The open shift of a register, locked until the end of the current transaction.
     */
    public Shift requireOpenShift(long cashRegisterId) {
        return shiftRepository.findWithLockByCashRegisterIdAndStatus(cashRegisterId, ShiftStatus.OPEN)
                .orElseThrow(() -> new IllegalStateException(
                        "La caja " + cashRegisterId + " no tiene un turno abierto. Abra un turno primero."));
    }

    /** Records cash entering or leaving the drawer and keeps the register balance in sync. */
    public Transaction recordCash(Shift shift, TransactionType type, long amount, UserAccount user, String reason,
            Sale sale) {
        Transaction transaction = new Transaction(amount, type, shift, user, reason);
        transaction.setSale(sale);
        cashRegisterRepository.addToBalance(shift.getCashRegister().getId(), transaction.signedAmount());
        return transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public ShiftDTO getCurrent(long cashRegisterId) {
        return shiftRepository.findFirstByCashRegisterIdAndStatus(cashRegisterId, ShiftStatus.OPEN)
                .map(this::toDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public ShiftDTO getById(long id) {
        return toDTO(find(id));
    }

    @Transactional(readOnly = true)
    public List<ShiftDTO> getRecent(int size) {
        return shiftRepository.findAllByOrderByOpenedAtDesc(PageRequest.of(0, size)).stream().map(this::toDTO).toList();
    }

    @Transactional
    public ShiftDTO open(ShiftRequestsDTO.Open request) {
        if (request.openingFloat() < 0) {
            throw new IllegalArgumentException("El fondo inicial no puede ser negativo.");
        }
        CashRegister cashRegister = cashRegisterRepository.findById(request.cashRegisterId())
                .orElseThrow(() -> new EntityNotFoundException("Cash register with id " + request.cashRegisterId()));
        if (shiftRepository.findFirstByCashRegisterIdAndStatus(cashRegister.getId(), ShiftStatus.OPEN).isPresent()) {
            throw new IllegalStateException("La caja ya tiene un turno abierto.");
        }
        Shift shift = new Shift();
        shift.setCashRegister(cashRegister);
        shift.setStatus(ShiftStatus.OPEN);
        shift.setOpenedBy(currentUserService.get());
        shift.setOpenedAt(Instant.now());
        shift.setOpeningFloat(request.openingFloat());
        Shift saved = shiftRepository.save(shift);
        // the counted float is the new starting point of the drawer
        cashRegisterRepository.setBalance(cashRegister.getId(), request.openingFloat());
        return toDTO(saved);
    }

    @Transactional
    public ShiftDTO addCashMovement(long shiftId, ShiftRequestsDTO.CashMovement request) {
        if (request.type() != TransactionType.DEPOSIT && request.type() != TransactionType.WITHDRAWAL) {
            throw new IllegalArgumentException("Solo se permiten entradas (DEPOSIT) o salidas (WITHDRAWAL) de efectivo.");
        }
        if (request.amount() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero.");
        }
        if (request.reason() == null || request.reason().isBlank()) {
            throw new IllegalArgumentException("Debe indicar el motivo.");
        }
        Shift shift = requireOpenShift(find(shiftId).getCashRegister().getId());
        if (shift.getId() != shiftId) {
            throw new IllegalStateException("El turno no está abierto.");
        }
        if (request.type() == TransactionType.WITHDRAWAL && request.amount() > expectedCash(shift)) {
            throw new IllegalArgumentException("No hay suficiente efectivo en la caja.");
        }
        recordCash(shift, request.type(), request.amount(), currentUserService.get(), request.reason().trim(), null);
        return toDTO(shift);
    }

    @Transactional
    public ShiftDTO close(long shiftId, ShiftRequestsDTO.Close request) {
        if (request.countedCash() < 0) {
            throw new IllegalArgumentException("El efectivo contado no puede ser negativo.");
        }
        Shift shift = requireOpenShift(find(shiftId).getCashRegister().getId());
        if (shift.getId() != shiftId) {
            throw new IllegalStateException("El turno no está abierto.");
        }
        shift.setExpectedCash(expectedCash(shift));
        shift.setCountedCash(request.countedCash());
        shift.setNotes(request.notes());
        shift.setClosedBy(currentUserService.get());
        shift.setClosedAt(Instant.now());
        shift.setStatus(ShiftStatus.CLOSED);
        Shift saved = shiftRepository.save(shift);
        cashRegisterRepository.setBalance(shift.getCashRegister().getId(), request.countedCash());
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public ShiftReportDTO report(long shiftId) {
        Shift shift = find(shiftId);
        List<Sale> sales = saleRepository.findByShiftId(shiftId);
        List<Refund> refunds = refundRepository.findByShiftId(shiftId);
        List<Transaction> transactions = transactionRepository.findByShiftIdOrderByDateAsc(shiftId);

        int salesCount = 0;
        int voidedCount = 0;
        long subtotal = 0, taxTotal = 0, discountTotal = 0, salesTotal = 0, voidedTotal = 0;
        Map<PaymentMethod, Long> salesByMethod = new EnumMap<>(PaymentMethod.class);
        for (Sale sale : sales) {
            if (sale.getStatus() == SaleStatus.VOIDED) {
                voidedCount++;
                voidedTotal += sale.getTotal();
                continue;
            }
            salesCount++;
            subtotal += sale.getSubtotal();
            taxTotal += sale.getTaxTotal();
            discountTotal += sale.getDiscount();
            salesTotal += sale.getTotal();
            for (Payment payment : sale.getPayments()) {
                salesByMethod.merge(payment.getMethod(), payment.getAmount(), Long::sum);
            }
        }

        long refundsTotal = 0;
        Map<PaymentMethod, Long> refundsByMethod = new EnumMap<>(PaymentMethod.class);
        for (Refund refund : refunds) {
            refundsTotal += refund.getAmount();
            refundsByMethod.merge(refund.getMethod(), refund.getAmount(), Long::sum);
        }

        long cashSales = 0, cashRefunds = 0, deposits = 0, withdrawals = 0;
        List<ShiftReportDTO.Movement> movements = new ArrayList<>();
        for (Transaction t : transactions) {
            switch (t.getTransactionType()) {
                case SALE -> cashSales += t.getAmount();
                case REFUND -> cashRefunds += t.getAmount();
                case DEPOSIT -> deposits += t.getAmount();
                case WITHDRAWAL -> withdrawals += t.getAmount();
            }
            movements.add(new ShiftReportDTO.Movement(t.getId(), t.getDate(), t.getTransactionType(), t.getAmount(),
                    username(t.getUser()), t.getReason(), t.getSale() == null ? null : t.getSale().getId()));
        }

        return new ShiftReportDTO(toDTO(shift), salesCount, subtotal, taxTotal, discountTotal, salesTotal,
                salesByMethod, voidedCount, voidedTotal, refunds.size(), refundsTotal, refundsByMethod,
                cashSales, cashRefunds, deposits, withdrawals, movements);
    }

    private long expectedCash(Shift shift) {
        long expected = shift.getOpeningFloat();
        for (Transaction t : transactionRepository.findByShiftIdOrderByDateAsc(shift.getId())) {
            expected += t.signedAmount();
        }
        return expected;
    }

    private Shift find(long id) {
        return shiftRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Shift with id " + id));
    }

    private ShiftDTO toDTO(Shift shift) {
        boolean closed = shift.getStatus() == ShiftStatus.CLOSED;
        long expected = closed ? shift.getExpectedCash() : expectedCash(shift);
        Long difference = closed ? shift.getCountedCash() - shift.getExpectedCash() : null;
        return new ShiftDTO(shift.getId(), shift.getCashRegister().getId(), shift.getCashRegister().getName(),
                shift.getStatus(), username(shift.getOpenedBy()), shift.getOpenedAt(), shift.getOpeningFloat(),
                username(shift.getClosedBy()), shift.getClosedAt(), expected, shift.getCountedCash(), difference,
                shift.getNotes());
    }

    static String username(UserAccount user) {
        if (user == null) {
            return null;
        }
        return user.getName() != null && !user.getName().isBlank() ? user.getName() : user.getUsername();
    }
}
