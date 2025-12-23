// package com.projectx.mental_health_api.repository;

// public class UserRepository {
    
// }

// 2nd
// package com.projectx.mental_health_api.repository;   // change to your package

// import com.projectx.mental_health_api.model.User;   // adjust package if needed
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// @Repository
// public interface UserRepository extends JpaRepository<User, Long> {
//     // no code needed; JpaRepository already gives save, findById, findAll, deleteById, etc.
// }


package com.projectx.mental_health_api.repository;

import com.projectx.mental_health_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
