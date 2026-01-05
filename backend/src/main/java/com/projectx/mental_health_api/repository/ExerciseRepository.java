package com.projectx.mental_health_api.repository;

import com.projectx.mental_health_api.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByCategory(String category);

    List<Exercise> findByDuration(Integer duration);

    List<Exercise> findByMoodType(String moodType);

    List<Exercise> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String titleKeyword,
            String descriptionKeyword);

    @org.springframework.data.jpa.repository.Query("SELECT e FROM Exercise e WHERE " +
            "(:category IS NULL OR e.category = :category) AND " +
            "(:duration IS NULL OR e.duration = :duration) AND " +
            "(:mood IS NULL OR e.moodType = :mood)")
    List<Exercise> searchExercises(
            @org.springframework.data.repository.query.Param("category") String category,
            @org.springframework.data.repository.query.Param("duration") Integer duration,
            @org.springframework.data.repository.query.Param("mood") String mood);
}