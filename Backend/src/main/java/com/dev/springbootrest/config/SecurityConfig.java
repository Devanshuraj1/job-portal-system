package com.dev.springbootrest.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;


    // =========================
    // Authentication Provider
    // =========================

    @Bean
    public AuthenticationProvider authProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
                userDetailsService
        );

        provider.setPasswordEncoder(
                new BCryptPasswordEncoder(12)
        );

        return provider;
    }


    // =========================
    // Authentication Manager
    // =========================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config)
            throws Exception {

        return config.getAuthenticationManager();
    }


    // =========================
    // Security Filter Chain
    // =========================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                // =========================
                // CSRF
                // =========================

                .csrf(csrf -> csrf.disable())


                // =========================
                // CORS
                // =========================

                .cors(Customizer.withDefaults())


                // =========================
                // AUTHORIZATION
                // =========================

                .authorizeHttpRequests(auth -> auth


                        // -------------------------
                        // Authentication
                        // -------------------------

                        .requestMatchers(
                                "/auth/register",
                                "/auth/login"
                        ).permitAll()


                        // -------------------------
                        // Anyone can VIEW jobs
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/jobPosts",
                                "/jobPosts/**",
                                "/load"
                        ).permitAll()


                        // -------------------------
                        // Recruiter + Admin
                        // CREATE job
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/jobPost"
                        ).hasAnyAuthority(
                                "RECRUITER",
                                "ADMIN"
                        )


                        // -------------------------
                        // Recruiter + Admin
                        // UPDATE job
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/jobPost/**"
                        ).hasAnyAuthority(
                                "RECRUITER",
                                "ADMIN"
                        )


                        // -------------------------
                        // Recruiter + Admin
                        // DELETE job
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/jobPost/**"
                        ).hasAnyAuthority(
                                "RECRUITER",
                                "ADMIN"
                        )


                        // -------------------------
                        // ADMIN ONLY
                        // -------------------------

                        .requestMatchers(
                                "/admin/**"
                        ).hasAuthority("ADMIN")


                        // -------------------------
                        // Everything else
                        // -------------------------

                        .anyRequest().authenticated()
                )


                // =========================
                // JWT STATELESS
                // =========================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =========================
                // JWT FILTER
                // =========================

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000",
                        "http://localhost:3001"
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of("*")
        );


        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}