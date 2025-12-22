package com.eunoia.virtualpet.repository;

import com.eunoia.virtualpet.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Correctly fetches the last 20 raw messages
    List<ChatMessage> findTop20ByOrderByTimestampDesc();
}