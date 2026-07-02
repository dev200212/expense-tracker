package com.expense.expense_backend.security;

import java.io.IOException;
import java.util.Enumeration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component

public class JwtFilter extends OncePerRequestFilter {

    

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(

        

            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)

            throws ServletException, IOException {
                Enumeration<String> headerNames = request.getHeaderNames();

while (headerNames.hasMoreElements()) {

    String name = headerNames.nextElement();

    System.out.println(name + " = " + request.getHeader(name));

}

String authHeader = request.getHeader("Authorization");

System.out.println("Authorization = " + authHeader);
 
                //  String authHeader = request.getHeader("Authorization");
                 System.out.println(authHeader);
            String token = null;
            String email = null;

            if(authHeader != null && authHeader.startsWith("Bearer ")){
                token = authHeader.substring(7);
                email = jwtUtil.extractEmail(token);
            }
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
   UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
   if (jwtUtil.validateToken(token, userDetails.getUsername())) {
       UsernamePasswordAuthenticationToken authentication =
               new UsernamePasswordAuthenticationToken(
                       userDetails,
                       null,
                       userDetails.getAuthorities());
       authentication.setDetails(
               new WebAuthenticationDetailsSource().buildDetails(request));
       SecurityContextHolder.getContext().setAuthentication(authentication);
   }
}
filterChain.doFilter(request, response);

    }

}
 
