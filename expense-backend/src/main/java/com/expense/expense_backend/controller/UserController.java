package com.expense.expense_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.expense_backend.model.OtpRequest;
import com.expense.expense_backend.model.User;
import com.expense.expense_backend.repository.UserRepository;
import com.expense.expense_backend.security.JwtUtil;
import com.expense.expense_backend.services.EmailService;
import com.expense.expense_backend.services.OtpService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins ="http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepo;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpservice;


@PostMapping("/login")

public String login(@RequestBody User user) {
    System.out.println("Login api called");

    User dbUser = userRepo.findByEmail(user.getEmail()).orElse(null);
    System.out.println("Db user "+dbUser);


    if(dbUser == null){
        return null;
    }
    if(passwordEncoder.matches(user.getPassword(),dbUser.getPassword())){
        String otp = otpservice.generateOtp(dbUser.getEmail());
        emailService.sendOtp(dbUser.getEmail(),otp);

        String token = jwtUtil.generateToken(dbUser.getEmail());

        return "OTP Sent";
    }
    return "Invalid Email or Password";
}


    @PostMapping("/verifyOtp")
    public String verifyOtp(@RequestBody OtpRequest request){
        if(otpservice.verifyOtp(request.getEmail(), request.getOtp())){
            otpservice.removeOtp(request.getEmail());
            return jwtUtil.generateToken(request.getEmail());
        }
        return "Invalid OTP";
    }
 

    

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        
        return "User Registered Successfull";
    }

    
    
    @GetMapping("/me")
public User getLoggedUser(Authentication authentication) {
    String email = authentication.getName();
    return userRepo.findByEmail(email).orElseThrow();
}




}
