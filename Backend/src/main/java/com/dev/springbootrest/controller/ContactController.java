package com.dev.springbootrest.controller;

import com.dev.springbootrest.dto.ContactRequest;
import com.dev.springbootrest.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class ContactController {

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<String> sendContactMessage(
            @RequestBody ContactRequest request) {

        emailService.sendContactEmail(request);

        return ResponseEntity.ok("Message sent successfully");
    }
}
