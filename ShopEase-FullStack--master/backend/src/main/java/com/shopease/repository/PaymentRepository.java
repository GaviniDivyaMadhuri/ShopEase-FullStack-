package com.shopease.repository;

import com.shopease.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByOrder_OrderId(Long orderId);

    Optional<Payment> findByPaymentIdAndOrder_User_UserId(Long paymentId, Long userId);

    List<Payment> findByOrder_OrderIdAndOrder_User_UserId(Long orderId, Long userId);
}
