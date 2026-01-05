package com.projectx.mental_health_api.controller;

import com.projectx.mental_health_api.model.Exercise;
import com.projectx.mental_health_api.model.UserExercise;
import com.projectx.mental_health_api.repository.ExerciseRepository;
import com.projectx.mental_health_api.repository.UserExerciseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserExerciseController {

    private final UserExerciseRepository userExerciseRepository;
    private final ExerciseRepository exerciseRepository;

    public UserExerciseController(UserExerciseRepository userExerciseRepository,
            ExerciseRepository exerciseRepository) {
        this.userExerciseRepository = userExerciseRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @PostMapping("/{userId}/exercises/{exerciseId}")
    public ResponseEntity<?> markExerciseComplete(@PathVariable UUID userId, @PathVariable Long exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId).orElse(null);
        if (exercise == null) {
            return ResponseEntity.notFound().build();
        }

        UserExercise userExercise = new UserExercise();
        userExercise.setUserId(userId);
        userExercise.setExercise(exercise);
        userExercise.setCompletedAt(OffsetDateTime.now());

        UserExercise saved = userExerciseRepository.save(userExercise);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{userId}/completed-exercises")
    public ResponseEntity<List<Exercise>> getCompletedExercises(@PathVariable UUID userId) {
        List<UserExercise> completed = userExerciseRepository.findByUserIdOrderByCompletedAtDesc(userId);
        List<Exercise> exercises = completed.stream()
                .map(UserExercise::getExercise)
                .collect(Collectors.toList());
        return ResponseEntity.ok(exercises);
    }
}
