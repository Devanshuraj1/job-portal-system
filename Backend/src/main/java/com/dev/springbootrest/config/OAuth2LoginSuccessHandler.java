package com.dev.springbootrest.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.dev.springbootrest.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Value("${app.frontend-url:http://localhost:3003}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");

        try {
            String token = userService.verifyGoogleUser(email);

            // The React app consumes this token exactly like normal username/password login.
            String targetUrl = frontendUrl + "/oauth2/success?token="
                    + java.net.URLEncoder.encode(token, java.nio.charset.StandardCharsets.UTF_8);

            clearAuthenticationAttributes(request);
            getRedirectStrategy().sendRedirect(request, response, targetUrl);

        } catch (RuntimeException ex) {
            String message = java.net.URLEncoder.encode(
                    ex.getMessage() == null ? "Google login failed" : ex.getMessage(),
                    java.nio.charset.StandardCharsets.UTF_8
            );

            getRedirectStrategy().sendRedirect(
                    request,
                    response,
                    frontendUrl + "/login?oauthError=" + message
            );
        }
    }
}

