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

    // "breathing", "grounding", "mindfulness"
    @Column(name = "category")
    private String category;

    // in minutes, e.g. 5
    @Column(name = "duration")
    private Integer duration;

    // "anxious", "low", "overwhelmed"
    @Column(name = "mood_type")
    private String moodType;

    // short goal/summary
    @Column(columnDefinition = "text")
    private String description;

    // step‑by‑step text, separated by new lines
    @Column(columnDefinition = "text")
    private String instructions;

    // ---------- Getters ----------

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

    // ---------- Setters ----------

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
