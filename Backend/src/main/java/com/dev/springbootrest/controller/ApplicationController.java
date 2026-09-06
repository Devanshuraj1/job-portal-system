package com.dev.springbootrest.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.dev.springbootrest.model.ApplicationStatus;
import com.dev.springbootrest.model.JobApplication;
import com.dev.springbootrest.model.JobPost;
import com.dev.springbootrest.repo.JobApplicationRepo;
import com.dev.springbootrest.repo.JobRepo;
import com.dev.springbootrest.service.JobApplicationService;
import com.dev.springbootrest.service.ResumeService;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins={"http://localhost:3000","http://localhost:3001"}, allowCredentials="true")




public class ApplicationController {
    @Autowired private JobApplicationService applicationService;
    @Autowired private ResumeService resumeService;
    @Autowired private JobApplicationRepo applicationRepo;
    @Autowired private JobRepo jobRepo;

    @PostMapping(value="/apply/{jobId}", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> applyForJob(@PathVariable int jobId, @RequestParam("resume") MultipartFile resume, Authentication authentication) {
        try {
            String username=authentication.getName();
            String stored=resumeService.saveResume(resume);
            String text=resumeService.extractText(stored);
            JobApplication app=applicationService.applyForJob(jobId, username, stored, text);
            return ResponseEntity.status(HttpStatus.CREATED).body(app);
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }



    @GetMapping("/my") public ResponseEntity<List<JobApplication>> getMyApplications(Authentication authentication){ return ResponseEntity.ok(applicationService.getUserApplications(authentication.getName())); }

    @GetMapping("/job/{jobId}") public ResponseEntity<List<JobApplication>> getJobApplicants(@PathVariable int jobId){ return ResponseEntity.ok(applicationService.getJobApplicants(jobId)); }


    @GetMapping public ResponseEntity<List<JobApplication>> getAllApplications(){ return ResponseEntity.ok(applicationService.getAllApplications()); }


    @GetMapping("/resume/{applicationId}")

    public ResponseEntity<?> getResume(@PathVariable int applicationId, Authentication authentication) {


        try {
            JobApplication app=applicationRepo.findById(applicationId).orElseThrow(() -> new RuntimeException("Application not found"));
            JobPost job=jobRepo.findById(app.getJobId()).orElseThrow(() -> new RuntimeException("Job not found"));
            String user=authentication.getName();


            if (!user.equals(app.getUsername()) &&
                    !user.equals(job.getPostedBy())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized");
            Path path=resumeService.getResumePath(app.getResumeFile());


            if (!Files.exists(path)) return ResponseEntity.notFound().build();
            FileSystemResource resource=new FileSystemResource(path);
            String contentType=Files.probeContentType(path);
            if(contentType==null) contentType="application/octet-stream";
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).header(HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=resume"+path.getFileName().toString().substring(path.getFileName().toString().lastIndexOf('.'))).body(resource);
        }

        catch(Exception e){ return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PatchMapping("/{applicationId}/status")


    public ResponseEntity<?> updateApplicationStatus(@PathVariable int applicationId,@RequestBody ApplicationStatus newStatus,Authentication authentication){


        try { return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId,newStatus,authentication.getName())); }


        catch(RuntimeException e){ return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
