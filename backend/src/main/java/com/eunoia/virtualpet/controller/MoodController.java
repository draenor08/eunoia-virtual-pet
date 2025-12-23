package com.eunoia.virtualpet.controller;

import com.eunoia.virtualpet.model.ChatMessage;
import com.eunoia.virtualpet.model.MoodEntry;
import com.eunoia.virtualpet.repository.ChatMessageRepository;
import com.eunoia.virtualpet.repository.MoodEntryRepository;
import com.eunoia.virtualpet.service.SentimentService; // Assuming you created this from our previous step
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
        // A. Fetch last 20 messages
        List<ChatMessage> recentChats = chatRepository.findTop20ByOrderByTimestampDesc();
        
        if (recentChats.isEmpty()) return null;

        // B. Combine them into one string (e.g., "I am sad. School is hard.")
        String combinedText = recentChats.stream()
                                         .map(ChatMessage::getContent)
                                         .collect(Collectors.joining(". "));

        // C. Call Twinword API via Service
        SentimentService.SentimentResult result = sentimentService.analyzeText(combinedText);

        // D. Save the Result as a MoodEntry
        MoodEntry entry = new MoodEntry();
        entry.setUserMessage("Batch Analysis of " + recentChats.size() + " messages");
        entry.setOverallSentiment(result.score());
        
        // Map scores for the graph
        if (result.score() > 0) entry.setJoyScore(result.score());
        else entry.setSadnessScore(Math.abs(result.score()));

        return moodRepository.save(entry);
    }

    // 3. GET HISTORY: For the Recharts Graph
    @GetMapping("/history")
    public List<MoodEntry> getMoodHistory() {
        return moodRepository.findTop10ByOrderByTimestampDesc();
    }
}