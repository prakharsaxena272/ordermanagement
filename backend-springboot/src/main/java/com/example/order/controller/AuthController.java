package com.example.order.controller;
import com.example.order.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/token")
    public ResponseEntity<String> getToken(@RequestParam String user) {
        return ResponseEntity.ok(jwtUtil.generateToken(user));
    }
}