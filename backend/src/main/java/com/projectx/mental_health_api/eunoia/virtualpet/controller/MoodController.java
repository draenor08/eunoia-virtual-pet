package com.projectx.mental_health_api.eunoia.virtualpet.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping; // Assuming you created this from our previous step
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectx.mental_health_api.eunoia.virtualpet.model.ChatMessage;
import com.projectx.mental_health_api.eunoia.virtualpet.model.MoodEntry;
import com.projectx.mental_health_api.eunoia.virtualpet.repository.ChatMessageRepository;
import com.projectx.mental_health_api.eunoia.virtualpet.repository.MoodEntryRepository;
import com.projectx.mental_health_api.eunoia.virtualpet.service.SentimentService;

@RestController
@RequestMapping("/api/mood")
@CrossOrigin(origins = "http://localhost:5173")
public class MoodController {

    @Autowired
    private ChatMessageRepository chatRepository;

    @Autowired
    private MoodEntryRepository moodRepository;

    @Autowired
    private SentimentService sentimentService; // The service that calls Twinword

    // 1. SAVE CHAT: Called every time the user hits "Enter"
    @PostMapping("/chat")
    public ChatMessage saveChat(@RequestBody String content) {
        ChatMessage msg = new ChatMessage();
        msg.setContent(content);
        msg.setUser(true);
        return chatRepository.save(msg);
    }

    // 2. ANALYZE BATCH: Called when user clicks "Check In" or "End Session"
    @PostMapping("/analyze-batch")
public MoodEntry analyzeRecentMessages() {
    System.out.println("--- [DEBUG] Controller: Starting Batch Analysis...");

    // A. Fetch last 20 messages
    List<ChatMessage> recentChats = chatRepository.findTop20ByOrderByTimestampDesc();
    System.out.println("--- [DEBUG] Controller: Found " + recentChats.size() + " recent messages.");

    if (recentChats.isEmpty()) {
        System.out.println("--- [DEBUG] Controller: No messages found. Aborting.");
        return null;
    }

    // B. Combine them
    String combinedText = recentChats.stream()
            .map(ChatMessage::getContent)
            .collect(Collectors.joining(". "));
    
    System.out.println("--- [DEBUG] Controller: Combined Text: " + combinedText);

    // C. Call Twinword API
    SentimentService.SentimentResult result = sentimentService.analyzeText(combinedText);

    // D. Save to DB
    MoodEntry entry = new MoodEntry();
    entry.setUserMessage("Batch Analysis of " + recentChats.size() + " messages");
    entry.setOverallSentiment(result.score());

    // Map scores
    if (result.score() > 0) {
        entry.setJoyScore(result.score());
        entry.setSadnessScore(0.0);
    } else {
        entry.setSadnessScore(Math.abs(result.score()));
        entry.setJoyScore(0.0);
    }

    MoodEntry savedEntry = moodRepository.save(entry);
    System.out.println("--- [DEBUG] Controller: SUCCESS! Saved MoodEntry to DB with ID: " + savedEntry.getId());

    return savedEntry;
}

    // 3. GET HISTORY: For the Recharts Graph
    @GetMapping("/history")
    public List<MoodEntry> getMoodHistory() {
        return moodRepository.findTop10ByOrderByTimestampDesc();
    }
}