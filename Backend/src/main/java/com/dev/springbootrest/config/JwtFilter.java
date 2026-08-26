package com.dev.springbootrest.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.springbootrest.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("=================================");
        System.out.println("REQUEST : " + request.getMethod()
                + " " + request.getRequestURI());
        System.out.println("AUTH HEADER : " + authHeader);

        // No JWT
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("NO JWT TOKEN FOUND");

            filterChain.doFilter(request, response);
            return;
        }

        try {

            String token = authHeader.substring(7);

            System.out.println("TOKEN FOUND");

            String username =
                    jwtService.extractUsername(token);

            System.out.println("USERNAME FROM TOKEN : " + username);

            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(username);

                System.out.println(
                        "USER FOUND : "
                                + userDetails.getUsername());

                System.out.println(
                        "AUTHORITIES : "
                                + userDetails.getAuthorities());

                if (jwtService.validateToken(
                        token,
                        userDetails)) {

                    UsernamePasswordAuthenticationToken
                            authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);

                    System.out.println(
                            "JWT AUTHENTICATION SUCCESS");
                } else {

                    System.out.println(
                            "JWT VALIDATION FAILED");
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR : " + e.getMessage());

            SecurityContextHolder
                    .clearContext();
        }

        filterChain.doFilter(request, response);
    }
}