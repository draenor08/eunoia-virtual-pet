package com.projectx.mental_health_api.eunoia.virtualpet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectx.mental_health_api.eunoia.virtualpet.model.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Correctly fetches the last 20 raw messages
    List<ChatMessage> findTop20ByOrderByTimestampDesc();
}