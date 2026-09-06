package com.dev.springbootrest.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {
    private final Path uploadDir = Paths.get("uploads", "resumes");

    public String saveResume(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Resume file is required");
        String original = file.getOriginalFilename() == null ? "resume" : file.getOriginalFilename();
        String lower = original.toLowerCase(Locale.ROOT);
        if (!lower.endsWith(".pdf") && !lower.endsWith(".docx")) {
            throw new IllegalArgumentException("Only PDF and DOCX resumes are supported");
        }
        if (file.getSize() > 5 * 1024 * 1024) throw new IllegalArgumentException("Resume must be 5 MB or smaller");
        Files.createDirectories(uploadDir);
        String stored = UUID.randomUUID() + (lower.endsWith(".pdf") ? ".pdf" : ".docx");
        Files.copy(file.getInputStream(), uploadDir.resolve(stored));
        return stored;
    }

    public String extractText(String storedFilename) throws IOException {
        Path file = uploadDir.resolve(storedFilename).normalize();
        if (!file.startsWith(uploadDir.toAbsolutePath().normalize()) && !file.startsWith(uploadDir.normalize()))
            throw new IllegalArgumentException("Invalid resume path");
        String lower = storedFilename.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".pdf")) {
            try (var doc = Loader.loadPDF(file.toFile())) {
                return new PDFTextStripper().getText(doc);
            }
        }
        try (XWPFDocument doc = new XWPFDocument(Files.newInputStream(file))) {
            StringBuilder out = new StringBuilder();
            doc.getParagraphs().forEach(x -> out.append(x.getText()).append('\n'));
            doc.getTables().forEach(t -> t.getRows().forEach(r -> r.getTableCells().forEach(c -> out.append(c.getText()).append(' '))));
            return out.toString();
        }
    }

    public Path getResumePath(String storedFilename) {
        return uploadDir.resolve(storedFilename).normalize();
    }
}
