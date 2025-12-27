package com.projectx.mental_health_api.eunoia.virtualpet.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    private SentimentService sentimentService;

    // --- DTO: Helper class to read the JSON body { "userId": "..." } ---
    public static class AnalysisRequest {

        private String userId;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }

    // 1. ANALYZE BATCH: Now accepts userId!
    @PostMapping("/analyze-batch")
    public MoodEntry analyzeRecentMessages(@RequestBody AnalysisRequest request) { // <--- CHANGED

        String userId = request.getUserId();
        if (userId == null || userId.isEmpty()) {
            userId = "anonymous";
        }

        System.out.println("--- [DEBUG] Controller: Starting Batch Analysis for: " + userId);

        // A. Fetch last 20 messages FOR THIS USER
        List<ChatMessage> recentChats = chatRepository.findTop20ByUserIdOrderByTimestampDesc(userId); // <--- FIXED

        System.out.println("--- [DEBUG] Controller: Found " + recentChats.size() + " messages.");

        if (recentChats.isEmpty()) {
            return null; // This will return empty body to frontend, handled by your "No Data" logic
        }

        // B. Combine them
        String combinedText = recentChats.stream()
                .map(ChatMessage::getContent)
                .collect(Collectors.joining(". "));

        // C. Call Twinword API
        SentimentService.SentimentResult result = sentimentService.analyzeText(combinedText);

        // D. Save to DB (WITH UserID)
        MoodEntry entry = new MoodEntry();
        entry.setUserId(userId); // <--- IMPORTANT: Link result to user
        entry.setUserMessage("Analysis of " + recentChats.size() + " messages");
        entry.setOverallSentiment(result.score());

        // Map specific emotion scores if available
        if (result.score() > 0) {
            entry.setJoyScore(result.score());
            entry.setSadnessScore(0.0);
        } else {
            entry.setSadnessScore(Math.abs(result.score()));
            entry.setJoyScore(0.0);
        }

        return moodRepository.save(entry);
    }

    // 2. GET HISTORY: Now filters by User ID
    @GetMapping("/history")
    public List<MoodEntry> getMoodHistory(@RequestParam String userId) { // <--- CHANGED
        return moodRepository.findTop10ByUserIdOrderByTimestampDesc(userId);
    }
}
