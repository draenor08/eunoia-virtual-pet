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
import org.springframework.web.bind.annotation.RestController;

import com.projectx.mental_health_api.model.User;
import com.projectx.mental_health_api.repository.UserRepository;

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
                    existing.setEmail(updated.getEmail());
                    existing.setUsername(updated.getUsername());

                    // Only update passwordHash if a new value is provided
                    if (updated.getPasswordHash() != null && !updated.getPasswordHash().isBlank()) {
                        existing.setPasswordHash(updated.getPasswordHash());
                    }

                    existing.setFullName(updated.getFullName());
                    existing.setLastName(updated.getLastName());
                    existing.setPhoneNumber(updated.getPhoneNumber());
                    existing.setPreferences(updated.getPreferences());
                    existing.setProgress(updated.getProgress());
                    existing.setProfilePictureUrl(updated.getProfilePictureUrl());
                    existing.setDateOfBirth(updated.getDateOfBirth());
                    existing.setEmailNotifications(updated.getEmailNotifications());
                    existing.setSmsNotifications(updated.getSmsNotifications());
                    existing.setIsActive(updated.getIsActive());
                    existing.setIsEmailVerified(updated.getIsEmailVerified());
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
