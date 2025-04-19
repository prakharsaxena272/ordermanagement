package com.example.order.service;
import com.example.order.model.OrderEntity;
import com.example.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    @Autowired
    private OrderRepository repository;

    public void saveOrder(OrderEntity entity) {
        repository.save(entity);
    }
}