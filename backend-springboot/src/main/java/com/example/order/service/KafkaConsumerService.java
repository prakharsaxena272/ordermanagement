package com.example.order.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.example.order.model.OrderEvent;

@Service
public class KafkaConsumerService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "order-topic", groupId = "order-group")
    @Async
    public void processOrder(OrderEvent event) throws InterruptedException {
        messagingTemplate.convertAndSend("/topic/order-status", "Order Confirmed: " + event.getOrderId());
        Thread.sleep(1000);
        messagingTemplate.convertAndSend("/topic/order-status", "Packed: " + event.getOrderId());
        Thread.sleep(1000);
        messagingTemplate.convertAndSend("/topic/order-status", "Shipped: " + event.getOrderId());
    }
}