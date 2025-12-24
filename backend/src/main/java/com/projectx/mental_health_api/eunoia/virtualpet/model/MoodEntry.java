package com.projectx.mental_health_api.eunoia.virtualpet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Entity
@Data // Automatically generates Getters, Setters, and ToString via Lombok
public class MoodEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The text the user sent to the chat
    @Column(columnDefinition = "TEXT")
    private String userMessage;

    // Sentiment scores from the AI API
    private double joyScore;
    private double sadnessScore;
    private double angerScore;
    private double overallSentiment; // e.g., -1.0 (negative) to 1.0 (positive)

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}