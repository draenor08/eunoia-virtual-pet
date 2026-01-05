package com.projectx.mental_health_api.repository;

import com.projectx.mental_health_api.model.UserExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserExerciseRepository extends JpaRepository<UserExercise, Long> {
    List<UserExercise> findByUserIdOrderByCompletedAtDesc(UUID userId);
}
