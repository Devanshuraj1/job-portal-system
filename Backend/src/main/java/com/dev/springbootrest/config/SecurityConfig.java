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



    // AUTHENTICATION PROVIDER


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



    // AUTHENTICATION MANAGER


    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config)
            throws Exception {

        return config.getAuthenticationManager();
    }



    // SECURITY FILTER CHAIN

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http


                // CSRF


                .csrf(csrf -> csrf.disable())



                // CORS


                .cors(Customizer.withDefaults())



                // AUTHORIZATION


                .authorizeHttpRequests(auth -> auth



                        // AUTH
                        // PUBLIC


                        .requestMatchers(
                                "/auth/register",
                                "/auth/login"
                        ).permitAll()


                        .requestMatchers(
                                HttpMethod.GET,
                                "/jobPosts/my"
                        ).hasAuthority("RECRUITER")


                        // GET JOBS
                        // PUBLIC


                        .requestMatchers(
                                HttpMethod.GET,
                                "/jobPosts",
                                "/jobPosts/**",
                                "/jobPost/**",
                                "/load"
                        ).permitAll()



                        // CREATE JOB
                        // AUTHENTICATED


                        .requestMatchers(
                                HttpMethod.POST,
                                "/jobPost"
                        ).authenticated()



                        // UPDATE JOB
                        // AUTHENTICATED


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/jobPost",
                                "/jobPost/**"
                        ).authenticated()



                        // DELETE JOB
                        // AUTHENTICATED


                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/jobPost",
                                "/jobPost/**"
                        ).authenticated()



                        // APPLY FOR JOB
                        // USER ONLY


                        .requestMatchers(
                                HttpMethod.POST,
                                "/applications/apply/**"
                        ).hasAuthority("USER")



                        // MY APPLICATIONS
                        // USER ONLY


                        .requestMatchers(
                                HttpMethod.GET,
                                "/applications/my"
                        ).hasAuthority("USER")



                        // JOB APPLICANTS
                        // RECRUITER + ADMIN


                        .requestMatchers(
                                HttpMethod.GET,
                                "/applications/job/**"
                        ).hasAnyAuthority(
                                "RECRUITER",
                                "ADMIN"
                        )



                        // ALL APPLICATIONS
                        // ADMIN ONLY


                        .requestMatchers(
                                HttpMethod.GET,
                                "/applications"
                        ).hasAuthority("ADMIN")

                        // ADMIN APIs

                        .requestMatchers(
                                "/admin/**"
                        ).hasAuthority("ADMIN")


                        // EVERYTHING ELSE

                        .anyRequest().authenticated()
                )


                // STATELESS JWT SESSION
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // JWT FILTER

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // CORS CONFIGURATION
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://localhost:3002",
                        "http://localhost:3003",
                        "http://localhost:3004",
                        "http://localhost:3005",
                        "http://localhost:3006"
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