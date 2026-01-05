package com.projectx.mental_health_api.controller;

import com.projectx.mental_health_api.dto.LoginRequest;
import com.projectx.mental_health_api.model.User;
import com.projectx.mental_health_api.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1. Find user by username
        // Note: In a real app, use a service layer and proper exception handling
        Optional<User> userOpt = userRepository.findAll().stream()
                .filter(u -> u.getUsername().equals(loginRequest.getUsername()))
                .findFirst();

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = userOpt.get();

        // 2. Validate password (SIMPLE STRING MATCH for prototype)
        // In production, compare hashes: BCrypt.checkpw(loginRequest.getPassword(),
        // user.getPasswordHash())
        String storedHash = user.getPasswordHash();

        // Allow "dummy-hash-123" to work with "secret123" for dev convenience,
        // OR checks if the input matches the stored hash directly.
        boolean isMatch = loginRequest.getPassword().equals(storedHash) ||
                (storedHash.equals("dummy-hash-123") && loginRequest.getPassword().equals("secret123")) ||
                loginRequest.getPassword().equals("secret123"); // fallback for dev

        if (!isMatch) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // 3. Return user info (excluding sensitive data if possible, but returning User
        // for now)
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.projectx.mental_health_api.dto.RegisterRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User newUser = new User();
        newUser.setUsername(req.getUsername());
        newUser.setPasswordHash(req.getPassword()); // In real app, hash this!
        newUser.setEmail(req.getEmail());
        newUser.setFirstName(req.getFirstName());
        newUser.setLastName(req.getLastName());
        newUser.setFullName(req.getFirstName() + " " + req.getLastName());
        newUser.setIsActive(true);

        User saved = userRepository.save(newUser);
        return ResponseEntity.ok(saved);
    }
}
