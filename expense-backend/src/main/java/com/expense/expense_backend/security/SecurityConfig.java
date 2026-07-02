package com.expense.expense_backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration

public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean

    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                .requestMatchers("/h2-console/**").permitAll()

                .requestMatchers("/api/users/register").permitAll()

                .requestMatchers("/api/users/login").permitAll()
                // .requestMatchers("/expenses/**").permitAll()
                .requestMatchers("/otp").permitAll()
                .requestMatchers("/api/users/verifyOtp").permitAll()

                //expense api
                // .requestMatchers("/expenses/**").permitAll()     
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // .requestMatchers("/admin/**").permitAll()
                // .requestMatchers("/expenses/**").authenticated()
                .requestMatchers("/expenses/**").hasAnyRole("USER","ADMIN")
                .anyRequest().authenticated()

                
            )
            .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class)

            .headers(headers ->

                headers.frameOptions(frame -> frame.disable())

            );

        return http.build();

    };

    

}
 