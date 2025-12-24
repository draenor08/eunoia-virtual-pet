package com.projectx.mental_health_api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.projectx.mental_health_api.model.User;
import com.projectx.mental_health_api.repository.UserRepository;

@Component
public class DevDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DevDataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only create the user if the database is empty
        if (userRepository.count() == 0) {
            User testUser = new User();

            // --- 1. REQUIRED FIELDS (Must be set to avoid crashes) ---
            testUser.setEmail("test@example.com");       // nullable = false
            testUser.setUsername("testuser");            // nullable = false
            testUser.setPasswordHash("dummy-hash-123");  // nullable = false

            // --- 2. OPTIONAL DATA (For your Frontend UI) ---
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setFullName("Test User");
            testUser.setPreferences("{\"description\": \"I like deep breathing exercises.\", \"theme\": \"calm\"}");
            testUser.setIsActive(true);
            testUser.setLoginCount(0);

            // Save to DB (Generates the UUID)
            User savedUser = userRepository.save(testUser);

            System.out.println("=================================================");
            System.out.println("✅ BACKEND STARTED SUCCESSFULLY");
            System.out.println("👤 Test User Created");
            System.out.println("🔑 UUID for App.tsx: " + savedUser.getId());
            System.out.println("=================================================");
        } else {
            // If user already exists, just print their ID
            User existing = userRepository.findAll().get(0);
            System.out.println("=================================================");
            System.out.println("ℹ️ APP RUNNING - EXISTING USER FOUND");
            System.out.println("🔑 UUID for App.tsx: " + existing.getId());
            System.out.println("=================================================");
        }
    }
}
