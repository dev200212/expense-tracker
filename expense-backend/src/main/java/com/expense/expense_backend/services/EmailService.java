package com.expense.expense_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Expense Tracker OTP Verification");
        message.setText("Your OTP is: "+ otp + "\n\nThis OTP is valid for 2 minutes."+"\n\n\n\nTeam Expense Tracker\nThanks");
        mailSender.send(message);
    }
    
}
