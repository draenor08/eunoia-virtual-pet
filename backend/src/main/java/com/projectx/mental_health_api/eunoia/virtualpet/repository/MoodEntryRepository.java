package com.projectx.mental_health_api.eunoia.virtualpet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectx.mental_health_api.eunoia.virtualpet.model.MoodEntry;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

    // ✅ NEW: Fetch history ONLY for the requested user
    List<MoodEntry> findTop10ByUserIdOrderByTimestampDesc(String userId);
}
