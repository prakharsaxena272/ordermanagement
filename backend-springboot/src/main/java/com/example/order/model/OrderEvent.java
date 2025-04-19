package com.example.order.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {
    private String orderId;
    private String product;
    private String customer;
    private OrderStatus status;
    private String updatedBy;
    private String location;
    private String notes;

    public enum OrderStatus {
        CREATED,
        CONFIRMED,
        PACKED,
        SHIPPED,
        OUT_FOR_DELIVERY,
        DELIVERED
    }
}