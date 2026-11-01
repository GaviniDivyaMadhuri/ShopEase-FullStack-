package com.shopease.repository;

import com.shopease.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser_UserIdOrderByOrderDateDesc(Long userId);

    Optional<Order> findByOrderIdAndUser_UserId(Long orderId, Long userId);

    List<Order> findAllByOrderByOrderDateDesc();
}
