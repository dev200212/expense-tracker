package com.expense.expense_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.expense.expense_backend.services.EmailService;
import com.expense.expense_backend.services.OtpService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class OtpTestController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;


    @GetMapping("/otp")
    public String sendOtp() {
        String email = "officialdev8077@gmail.com";
        String otp = otpService.generateOtp(email);
        emailService.sendOtp(email, otp);
        return "OTP Sent Successfully";
    }
    
    
}
