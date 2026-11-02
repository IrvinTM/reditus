package com.irvin.pos.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.irvin.pos.dtos.CustomPageDTO;
import com.irvin.pos.dtos.RefundDTO;
import com.irvin.pos.dtos.RefundRequestDTO;
import com.irvin.pos.dtos.SaleDTO;
import com.irvin.pos.dtos.SaleItemDTO;
import com.irvin.pos.dtos.SaleRequestDTO;
import com.irvin.pos.dtos.VoidSaleRequestDTO;
import com.irvin.pos.entities.CashRegister;
import com.irvin.pos.entities.Customer;
import com.irvin.pos.entities.Payment;
import com.irvin.pos.entities.PaymentMethod;
import com.irvin.pos.entities.Product;
import com.irvin.pos.entities.Refund;
import com.irvin.pos.entities.RefundItem;
import com.irvin.pos.entities.Sale;
import com.irvin.pos.entities.SaleItem;
import com.irvin.pos.entities.SaleStatus;
import com.irvin.pos.entities.Shift;
import com.irvin.pos.entities.Tax;
import com.irvin.pos.entities.TransactionType;
import com.irvin.pos.entities.UserAccount;
import com.irvin.pos.exceptions.EntityNotFoundException;
import com.irvin.pos.repositories.CashRegisterRepository;
import com.irvin.pos.repositories.CustomerRepository;
import com.irvin.pos.repositories.ProductRepository;
import com.irvin.pos.repositories.RefundRepository;
import com.irvin.pos.repositories.SaleRepository;
import com.irvin.pos.utils.CustomPage;
import com.irvin.pos.utils.SaleCalculator;

/**
 * Sales are immutable once completed: they can only be voided (whole sale) or refunded (some units).
 */
@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final CashRegisterRepository cashRegisterRepository;
    private final ProductRepository productRepository;
    private final RefundRepository refundRepository;
    private final ShiftService shiftService;
    private final CurrentUserService currentUserService;

    public SaleService(SaleRepository saleRepository, CustomerRepository customerRepository,
            CashRegisterRepository cashRegisterRepository, ProductRepository productRepository,
            RefundRepository refundRepository, ShiftService shiftService, CurrentUserService currentUserService) {
        this.saleRepository = saleRepository;
        this.customerRepository = customerRepository;
        this.cashRegisterRepository = cashRegisterRepository;
        this.productRepository = productRepository;
        this.refundRepository = refundRepository;
        this.shiftService = shiftService;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public SaleDTO addSale(SaleRequestDTO request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("La venta no tiene productos.");
        }
        CashRegister cashRegister = cashRegisterRepository.findById(request.cashRegisterID())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cash Register with ID " + request.cashRegisterID() + " not found."));
        Shift shift = shiftService.requireOpenShift(cashRegister.getId());
        UserAccount cashier = currentUserService.get();

        // anonymous sales have no customer
        Customer customer = null;
        if (request.customerID() != null) {
            customer = customerRepository.findById(request.customerID())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Customer with ID " + request.customerID() + " not found."));
        }

        Sale sale = new Sale();
        sale.setDate(Instant.now());
        sale.setStatus(SaleStatus.COMPLETED);
        sale.setCashRegister(cashRegister);
        sale.setShift(shift);
        sale.setCustomer(customer);
        sale.setCashier(cashier);

        List<SaleCalculator.LineAmounts> lines = new ArrayList<>();
        for (SaleRequestDTO.Item itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Product with ID " + itemRequest.productId() + " not found."));
            if (!product.isActive()) {
                throw new IllegalStateException("El producto " + product.getName() + " no está activo.");
            }

            long unitPrice = product.getSalesPrice();
            boolean overridden = itemRequest.price() != null && itemRequest.price() != unitPrice;
            if (overridden) {
                if (!product.allowPriceChange()) {
                    throw new IllegalArgumentException("El producto " + product.getName() + " no permite cambiar el precio.");
                }
                unitPrice = itemRequest.price();
            }

            SaleCalculator.LineAmounts amounts = SaleCalculator.line(unitPrice, itemRequest.quantity(),
                    product.priceIncludesTaxes(), taxPercent(product));
            lines.add(amounts);

            if (productRepository.decreaseAvailable(product.getId(), itemRequest.quantity()) == 0) {
                throw new IllegalStateException("No hay suficiente stock de " + product.getName() + ".");
            }

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setQuantity(itemRequest.quantity());
            item.setPriceAtSale(unitPrice);
            item.setPriceIncludesTaxes(product.priceIncludesTaxes());
            item.setPriceOverridden(overridden);
            item.setTaxAmount(amounts.tax());
            item.setLineTotal(amounts.total());
            item.setUnitCost(product.getCost());
            sale.getItems().add(item);
        }

        SaleCalculator.SaleAmounts totals = SaleCalculator.sale(lines, request.discount());
        sale.setSubtotal(totals.subtotal());
        sale.setTaxTotal(totals.taxTotal());
        sale.setDiscount(totals.discount());
        sale.setTotal(totals.total());

        long cashKept = applyPayments(sale, request.payments());
        Sale saved = saleRepository.save(sale);
        if (cashKept > 0) {
            shiftService.recordCash(shift, TransactionType.SALE, cashKept, cashier, null, saved);
        }
        return toDTO(saved);
    }

    /**
     * Validates the payments against the sale total and attaches them to the sale.
     * Card / mobile / other must not exceed what's due, cash covers the rest and gives change.
     *
     * @return cash that stays in the drawer
     */
    private long applyPayments(Sale sale, List<SaleRequestDTO.PaymentDTO> payments) {
        long remaining = sale.getTotal();
        long cashTendered = 0;
        if (payments != null) {
            for (SaleRequestDTO.PaymentDTO request : payments) {
                if (request.method() == null) {
                    throw new IllegalArgumentException("Debe indicar el método de pago.");
                }
                if (request.amount() <= 0) {
                    throw new IllegalArgumentException("El monto del pago debe ser mayor a cero.");
                }
                if (request.method() == PaymentMethod.CASH) {
                    cashTendered += request.amount();
                    continue;
                }
                if (request.amount() > remaining) {
                    throw new IllegalArgumentException("Los pagos que no son en efectivo no pueden exceder el total.");
                }
                remaining -= request.amount();
                sale.getPayments().add(payment(sale, request.method(), request.amount(), request.amount(), 0));
            }
        }
        if (cashTendered < remaining) {
            throw new IllegalArgumentException("El pago es insuficiente. Faltan " + (remaining - cashTendered) + " centavos.");
        }
        if (cashTendered > 0) {
            sale.getPayments().add(payment(sale, PaymentMethod.CASH, remaining, cashTendered, cashTendered - remaining));
        }
        return remaining;
    }

    private static Payment payment(Sale sale, PaymentMethod method, long amount, long tendered, long change) {
        Payment payment = new Payment();
        payment.setSale(sale);
        payment.setMethod(method);
        payment.setAmount(amount);
        payment.setTendered(tendered);
        payment.setChange(change);
        return payment;
    }

    /**
     * Cancels a whole sale: puts all items back in stock and gives back the cash that was paid.
     */
    @Transactional
    public SaleDTO voidSale(long saleId, VoidSaleRequestDTO request) {
        String reason = requireReason(request.reason());
        Sale sale = find(saleId);
        if (sale.getStatus() != SaleStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Solo se pueden anular ventas completadas sin devoluciones. Use una devolución.");
        }
        Shift shift = shiftService.requireOpenShift(request.cashRegisterId());
        UserAccount user = currentUserService.get();

        for (SaleItem item : sale.getItems()) {
            productRepository.increaseAvailable(item.getProduct().getId(), item.getQuantity());
        }
        long cashPaid = sale.getPayments().stream()
                .filter(p -> p.getMethod() == PaymentMethod.CASH)
                .mapToLong(Payment::getAmount)
                .sum();
        if (cashPaid > 0) {
            shiftService.recordCash(shift, TransactionType.REFUND, cashPaid, user, "Anulación: " + reason, sale);
        }

        sale.setStatus(SaleStatus.VOIDED);
        sale.setVoidedAt(Instant.now());
        sale.setVoidedBy(user);
        sale.setVoidReason(reason);
        return toDTO(saleRepository.save(sale));
    }

    /**
     * Returns some units of a sale: puts them back in stock and gives back their share of the total.
     */
    @Transactional
    public RefundDTO refund(long saleId, RefundRequestDTO request) {
        String reason = requireReason(request.reason());
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Debe indicar los productos a devolver.");
        }
        Sale sale = find(saleId);
        if (sale.getStatus() != SaleStatus.COMPLETED && sale.getStatus() != SaleStatus.PARTIALLY_REFUNDED) {
            throw new IllegalStateException("La venta ya fue anulada o devuelta por completo.");
        }
        Shift shift = shiftService.requireOpenShift(request.cashRegisterId());
        UserAccount user = currentUserService.get();
        PaymentMethod method = request.method() == null ? PaymentMethod.CASH : request.method();

        Refund refund = new Refund();
        refund.setSale(sale);
        refund.setDate(Instant.now());
        refund.setUser(user);
        refund.setShift(shift);
        refund.setReason(reason);
        refund.setMethod(method);

        long amount = 0;
        for (RefundRequestDTO.Item itemRequest : request.items()) {
            SaleItem item = sale.getItems().stream()
                    .filter(i -> i.getId() == itemRequest.saleItemId())
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El producto " + itemRequest.saleItemId() + " no pertenece a la venta."));
            int refundable = item.getQuantity() - item.getRefundedQuantity();
            if (itemRequest.quantity() <= 0 || itemRequest.quantity() > refundable) {
                throw new IllegalArgumentException("Solo se pueden devolver " + refundable + " unidades de "
                        + item.getProductName() + ".");
            }
            long itemAmount = SaleCalculator.refund(item.getLineTotal(), item.getQuantity(), itemRequest.quantity(),
                    sale.getTotal(), sale.getDiscount());
            item.setRefundedQuantity(item.getRefundedQuantity() + itemRequest.quantity());
            productRepository.increaseAvailable(item.getProduct().getId(), itemRequest.quantity());

            RefundItem refundItem = new RefundItem();
            refundItem.setRefund(refund);
            refundItem.setSaleItem(item);
            refundItem.setQuantity(itemRequest.quantity());
            refundItem.setAmount(itemAmount);
            refund.getItems().add(refundItem);
            amount += itemAmount;
        }

        boolean fullyRefunded = sale.getItems().stream().allMatch(i -> i.getRefundedQuantity() == i.getQuantity());
        if (fullyRefunded) {
            // absorb rounding so the whole sale total is given back exactly
            long difference = sale.getTotal() - sale.getRefundedTotal() - amount;
            amount += difference;
            List<RefundItem> items = refund.getItems();
            RefundItem last = items.get(items.size() - 1);
            last.setAmount(last.getAmount() + difference);
        }
        refund.setAmount(amount);
        sale.setRefundedTotal(sale.getRefundedTotal() + amount);
        sale.setStatus(fullyRefunded ? SaleStatus.REFUNDED : SaleStatus.PARTIALLY_REFUNDED);
        saleRepository.save(sale);
        Refund saved = refundRepository.save(refund);

        if (method == PaymentMethod.CASH && amount > 0) {
            shiftService.recordCash(shift, TransactionType.REFUND, amount, user, "Devolución: " + reason, sale);
        }
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public SaleDTO getSaleById(long saleId) {
        return toDTO(find(saleId));
    }

    @Transactional(readOnly = true)
    public List<RefundDTO> getRefunds(long saleId) {
        return refundRepository.findBySaleId(saleId).stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public CustomPageDTO<SaleDTO> getAllSales() {
        Page<Sale> sales = saleRepository.findAll(PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "date")));
        CustomPageDTO<SaleDTO> salesDTO = new CustomPageDTO<>();
        salesDTO.setCustomPage(
                new CustomPage(sales.getTotalElements(), sales.getTotalPages(),
                        sales.getNumber(), sales.getSize()));

        sales.forEach((sale) -> {
            salesDTO.addContent(toDTO(sale));
        });
        return salesDTO;
    }

    private Sale find(long saleId) {
        return saleRepository.findById(saleId)
                .orElseThrow(() -> new EntityNotFoundException("Sale with ID " + saleId + " not found."));
    }

    private static String requireReason(String reason) {
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Debe indicar el motivo.");
        }
        return reason.trim();
    }

    private static int taxPercent(Product product) {
        return product.getTaxes() == null ? 0 : product.getTaxes().stream().mapToInt(Tax::getPercentage).sum();
    }

    private SaleDTO toDTO(Sale sale) {
        List<SaleItemDTO> items = sale.getItems().stream()
                .map(i -> new SaleItemDTO(i.getId(), i.getProduct().getId(), i.getProductName(), i.getQuantity(),
                        i.getPriceAtSale(), i.isPriceIncludesTaxes(), i.getTaxAmount(), i.getLineTotal(),
                        i.getRefundedQuantity()))
                .toList();
        List<SaleDTO.PaymentDTO> payments = sale.getPayments().stream()
                .map(p -> new SaleDTO.PaymentDTO(p.getMethod(), p.getAmount(), p.getTendered(), p.getChange()))
                .toList();
        Customer customer = sale.getCustomer();
        return new SaleDTO(sale.getId(), sale.getDate(), sale.getStatus(), items, payments, sale.getSubtotal(),
                sale.getTaxTotal(), sale.getDiscount(), sale.getTotal(), sale.getRefundedTotal(),
                sale.getCashRegister().getId(), sale.getShift() == null ? null : sale.getShift().getId(),
                customer == null ? null : customer.getId(), customer == null ? null : customer.getName(),
                ShiftService.username(sale.getCashier()), sale.getVoidedAt(),
                ShiftService.username(sale.getVoidedBy()), sale.getVoidReason());
    }

    private RefundDTO toDTO(Refund refund) {
        List<RefundDTO.Item> items = refund.getItems().stream()
                .map(i -> new RefundDTO.Item(i.getSaleItem().getId(), i.getSaleItem().getProductName(),
                        i.getQuantity(), i.getAmount()))
                .toList();
        return new RefundDTO(refund.getId(), refund.getSale().getId(), refund.getDate(),
                ShiftService.username(refund.getUser()), refund.getReason(), refund.getMethod(), refund.getAmount(),
                items);
    }
}
