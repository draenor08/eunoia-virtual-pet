package com.projectx.mental_health_api.controller;

import com.projectx.mental_health_api.model.Exercise;
import com.projectx.mental_health_api.repository.ExerciseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "http://localhost:5173")
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;

    public ExerciseController(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        Exercise saved = exerciseRepository.save(exercise);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping
    public List<Exercise> getExercises(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer duration,
            @RequestParam(required = false, name = "mood") String mood
    ) {
        if (category != null) return exerciseRepository.findByCategory(category);
        if (duration != null) return exerciseRepository.findByDuration(duration);
        if (mood != null) return exerciseRepository.findByMoodType(mood);
        return exerciseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExercise(@PathVariable Long id) {
        return exerciseRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Exercise not found"));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchExercises(@RequestParam(required = false) String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return ResponseEntity.badRequest().body("Keyword is required");
        }
        List<Exercise> results =
                exerciseRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        keyword, keyword
                );
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        if (!exerciseRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Exercise not found");
        }
        exerciseRepository.deleteById(id);
        return ResponseEntity.ok("Exercise deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @RequestBody Exercise updated) {
        return exerciseRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setCategory(updated.getCategory());
                    existing.setDuration(updated.getDuration());
                    existing.setMoodType(updated.getMoodType());
                    existing.setDescription(updated.getDescription());
                    existing.setInstructions(updated.getInstructions());
                    exerciseRepository.save(existing);
                    return ResponseEntity.ok("Exercise updated successfully");
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Exercise not found"));
    }
}
