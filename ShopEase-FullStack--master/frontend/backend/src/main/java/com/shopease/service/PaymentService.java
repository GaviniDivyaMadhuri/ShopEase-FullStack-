package com.shopease.service;

import com.shopease.dto.PaymentRequest;
import com.shopease.dto.PaymentResponse;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Order;
import com.shopease.model.Payment;
import com.shopease.model.User;
import com.shopease.model.enums.PaymentMethod;
import com.shopease.model.enums.PaymentStatus;
import com.shopease.repository.OrderRepository;
import com.shopease.repository.PaymentRepository;
import com.shopease.security.CurrentUserProvider;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * DEMO / SIMULATED payment processing only.
 *
 * There is no real payment gateway behind this service.
 * We never accept or store card numbers, CVV, bank passwords,
 * or OTPs anywhere in this service.
 */
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final CurrentUserProvider currentUserProvider;

    // Constructor
    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            CurrentUserProvider currentUserProvider) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Order order =
                orderRepository
                        .findByOrderIdAndUser_UserId(
                                request.getOrderId(),
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found."
                                )
                        );

        PaymentMethod method =
                parsePaymentMethod(
                        request.getPaymentMethod()
                );

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setPaymentMethod(method);

        // Always take amount from the order.
        payment.setAmount(order.getTotalAmount());

        // Simulated payment result.
        // COD = PENDING
        // CARD / UPI = SUCCESS
        if (method == PaymentMethod.COD) {
            payment.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
        }

        Payment saved =
                paymentRepository.save(payment);

        return toResponse(saved);
    }

    public PaymentResponse getPaymentById(Long paymentId) {

        User user = currentUserProvider.getCurrentUser();

        Payment payment;

        if (currentUserProvider.isAdmin(user)) {

            payment =
                    paymentRepository
                            .findById(paymentId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Payment not found."
                                    )
                            );

        } else {

            payment =
                    paymentRepository
                            .findByPaymentIdAndOrder_User_UserId(
                                    paymentId,
                                    user.getUserId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Payment not found."
                                    )
                            );
        }

        return toResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByOrder(Long orderId) {

        User user = currentUserProvider.getCurrentUser();

        List<Payment> payments;

        if (currentUserProvider.isAdmin(user)) {

            payments =
                    paymentRepository
                            .findByOrder_OrderId(orderId);

        } else {

            payments =
                    paymentRepository
                            .findByOrder_OrderIdAndOrder_User_UserId(
                                    orderId,
                                    user.getUserId()
                            );
        }

        return payments.stream()
                .map(this::toResponse)
                .toList();
    }

    // ADMIN only
    // SecurityConfig should protect /api/admin/**

    public List<PaymentResponse> getAllPayments() {

        return paymentRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ---------- helpers ----------

    private PaymentMethod parsePaymentMethod(String raw) {

        try {

            return PaymentMethod.valueOf(
                    raw.toUpperCase()
            );

        } catch (IllegalArgumentException ex) {

            throw new IllegalArgumentException(
                    "Invalid payment method. Use COD, CARD, or UPI."
            );
        }
    }

    private PaymentResponse toResponse(Payment payment) {

        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getOrder().getOrderId(),
                payment.getPaymentMethod().name(),
                payment.getAmount(),
                payment.getPaymentStatus().name(),
                payment.getPaymentDate()
        );
    }
}