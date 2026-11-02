package com.irvin.pos.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.irvin.pos.entities.Shift;
import com.irvin.pos.entities.ShiftStatus;

import jakarta.persistence.LockModeType;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    Optional<Shift> findFirstByCashRegisterIdAndStatus(long cashRegisterId, ShiftStatus status);

    // locks the shift row so cash movements on the same register are serialized
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Shift> findWithLockByCashRegisterIdAndStatus(long cashRegisterId, ShiftStatus status);

    List<Shift> findAllByOrderByOpenedAtDesc(Pageable pageable);
}
