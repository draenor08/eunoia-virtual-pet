package com.eunoia.virtualpet.repository;

import com.eunoia.virtualpet.model.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {
    // Fetches history for the graph
    List<MoodEntry> findTop10ByOrderByTimestampDesc();
}