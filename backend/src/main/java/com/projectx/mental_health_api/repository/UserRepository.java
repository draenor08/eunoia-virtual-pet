// package com.projectx.mental_health_api.repository;

// public class UserRepository {
    
// }


package com.projectx.mental_health_api.repository;   // change to your package

import com.projectx.mental_health_api.model.User;   // adjust package if needed
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // no code needed; JpaRepository already gives save, findById, findAll, deleteById, etc.
}
