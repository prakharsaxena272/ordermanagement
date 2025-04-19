package com.example.order.controller;

import com.example.order.model.OrderEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private KafkaTemplate<String, OrderEvent> kafkaTemplate;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderEvent event, Authentication authentication) {
        event.setStatus(OrderEvent.OrderStatus.CREATED);
        event.setUpdatedBy(authentication.getName());
        kafkaTemplate.send("order-topic", event);
        return ResponseEntity.ok("Order created successfully");
    }

    @PostMapping("/pack")
    public ResponseEntity<?> packOrder(@RequestParam String orderId, Authentication authentication) {
        OrderEvent event = new OrderEvent();
        event.setOrderId(orderId);
        event.setStatus(OrderEvent.OrderStatus.PACKED);
        event.setUpdatedBy(authentication.getName());
        kafkaTemplate.send("order-topic", event);
        return ResponseEntity.ok("Order packed successfully");
    }

    @PostMapping("/ship")
    public ResponseEntity<?> shipOrder(@RequestParam String orderId, Authentication authentication) {
        OrderEvent event = new OrderEvent();
        event.setOrderId(orderId);
        event.setStatus(OrderEvent.OrderStatus.SHIPPED);
        event.setUpdatedBy(authentication.getName());
        kafkaTemplate.send("order-topic", event);
        return ResponseEntity.ok("Order shipped successfully");
    }

    @PostMapping("/deliver")
    public ResponseEntity<?> deliverOrder(@RequestParam String orderId, Authentication authentication) {
        OrderEvent event = new OrderEvent();
        event.setOrderId(orderId);
        event.setStatus(OrderEvent.OrderStatus.DELIVERED);
        event.setUpdatedBy(authentication.getName());
        kafkaTemplate.send("order-topic", event);
        return ResponseEntity.ok("Order delivered successfully");
    }
}