package com.projectx.mental_health_api.eunoia.virtualpet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue; // Add this
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor // Add this for JPA
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private boolean isUser; // true = User, false = AI

    private String userId;  // <--- NEW: Crucial for multi-user support

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // Constructor for easy saving
    public ChatMessage(String content, boolean isUser, String userId) {
        this.content = content;
        this.isUser = isUser;
        this.userId = userId;
    }
}
