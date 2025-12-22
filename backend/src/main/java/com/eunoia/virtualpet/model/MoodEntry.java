package com.eunoia.virtualpet.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

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