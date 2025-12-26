package com.projectx.mental_health_api.eunoia.virtualpet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectx.mental_health_api.eunoia.virtualpet.model.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // NEW: Find chats for a SPECIFIC user, ordered by newest first
    List<ChatMessage> findTop20ByUserIdOrderByTimestampDesc(String userId);
}
