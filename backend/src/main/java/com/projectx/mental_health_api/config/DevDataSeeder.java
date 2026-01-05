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
            testUser.setEmail("test@example.com"); // nullable = false
            testUser.setUsername("testuser"); // nullable = false
            testUser.setPasswordHash("dummy-hash-123"); // nullable = false

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
        }

        // Always ensure "Using Phru" exists for testing
        if (userRepository.findByEmail("using.phru@gmail.com").isEmpty()) {
            User phru = new User();
            phru.setEmail("using.phru@gmail.com");
            phru.setUsername("usingphru");
            phru.setPasswordHash("1234");
            phru.setFirstName("Using");
            phru.setLastName("Phru");
            phru.setFullName("Using Phru");
            phru.setIsActive(true);
            userRepository.save(phru);
            System.out.println("👤 'Using Phru' User Created");
        }

        if (userRepository.count() > 0) {
            // Print info for the first user found (just for log visibility)
            User existing = userRepository.findAll().get(0);
            System.out.println("=================================================");
            System.out.println("ℹ️ APP RUNNING - USERS EXIST");
            System.out.println("key UUID for App.tsx (example): " + existing.getId());
            System.out.println("=================================================");
        }
    }
}
