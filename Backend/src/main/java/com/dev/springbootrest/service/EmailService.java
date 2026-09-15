package com.dev.springbootrest.service;

import com.dev.springbootrest.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.to}")
    private String toEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(ContactRequest request) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setReplyTo(request.getEmail());
        message.setSubject("[Job Portal] " + request.getSubject());

        message.setText(
                "New message received from Job Portal\n\n" +
                "Name: " + request.getName() + "\n" +
                "Email: " + request.getEmail() + "\n" +
                "Subject: " + request.getSubject() + "\n\n" +
                "Message:\n" +
                request.getMessage()
        );

        mailSender.send(message);
    }
}
