package com.projectx.mental_health_api.eunoia.virtualpet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectx.mental_health_api.eunoia.virtualpet.model.MoodEntry;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {
    // Fetches history for the graph
    List<MoodEntry> findTop10ByOrderByTimestampDesc();
}