package com.projectx.mental_health_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic info
    @Column(nullable = false)
    private String title;          // e.g. "4–7–8 Breathing"

    private String category;       // "breathing", "grounding", "mindfulness"

    private Integer duration;      // in minutes, e.g. 5

    @Column(name = "mood_type")
    private String moodType;       // "anxious", "low", "overwhelmed"

    @Column(columnDefinition = "text")
    private String description;    // short goal/summary

    @Column(columnDefinition = "text")
    private String instructions;   // step‑by‑step text, separated by new lines

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public Integer getDuration() {
        return duration;
    }

    public String getMoodType() {
        return moodType;
    }

    public String getDescription() {
        return description;
    }

    public String getInstructions() {
        return instructions;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public void setMoodType(String moodType) {
        this.moodType = moodType;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
