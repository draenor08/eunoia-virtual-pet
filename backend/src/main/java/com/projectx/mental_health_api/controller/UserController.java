package com.projectx.mental_health_api.controller;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projectx.mental_health_api.model.User;
import com.projectx.mental_health_api.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@CrossOrigin(origins = "http://localhost:5173") // allow Vite dev server
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ---------- CREATE ----------

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // TODO: hash incoming password into passwordHash before saving
        User saved = userRepository.save(user);
        return ResponseEntity.status(201).body(saved);
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        try {
            // 1. Create uploads directory if not exists
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. Generate unique filename
            String filename = id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            // 3. Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 4. Update User URL (Assuming static serving is configured or just serving
            // relative)
            // For prototype, we'll return the full URL assuming backend serves it
            String fileUrl = "http://localhost:8080/uploads/" + filename;

            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setProfilePictureUrl(fileUrl);
                userRepository.save(user);
            }

            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not upload file: " + e.getMessage());
        }
    }

    // ---------- READ ----------

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable UUID id) {
        Optional<User> userOpt = userRepository.findById(id);
        return userOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------- UPDATE ----------

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody User updated) {
        return userRepository.findById(id)
                .map(existing -> {
                    if (updated.getEmail() != null)
                        existing.setEmail(updated.getEmail());
                    if (updated.getUsername() != null)
                        existing.setUsername(updated.getUsername());

                    // Only update passwordHash if a new value is provided
                    if (updated.getPasswordHash() != null && !updated.getPasswordHash().isBlank()) {
                        existing.setPasswordHash(updated.getPasswordHash());
                    }

                    if (updated.getFirstName() != null)
                        existing.setFirstName(updated.getFirstName());
                    if (updated.getFullName() != null)
                        existing.setFullName(updated.getFullName());
                    if (updated.getLastName() != null)
                        existing.setLastName(updated.getLastName());
                    if (updated.getPhoneNumber() != null)
                        existing.setPhoneNumber(updated.getPhoneNumber());
                    if (updated.getPreferences() != null)
                        existing.setPreferences(updated.getPreferences());
                    if (updated.getProgress() != null)
                        existing.setProgress(updated.getProgress());
                    if (updated.getProfilePictureUrl() != null)
                        existing.setProfilePictureUrl(updated.getProfilePictureUrl());
                    if (updated.getDateOfBirth() != null)
                        existing.setDateOfBirth(updated.getDateOfBirth());
                    if (updated.getEmailNotifications() != null)
                        existing.setEmailNotifications(updated.getEmailNotifications());
                    if (updated.getSmsNotifications() != null)
                        existing.setSmsNotifications(updated.getSmsNotifications());
                    if (updated.getIsActive() != null)
                        existing.setIsActive(updated.getIsActive());
                    if (updated.getIsEmailVerified() != null)
                        existing.setIsEmailVerified(updated.getIsEmailVerified());
                    if (updated.getUpdates() != null)
                        existing.setUpdates(updated.getUpdates());

                    User saved = userRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------- DELETE ----------

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
