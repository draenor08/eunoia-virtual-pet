package com.projectx.mental_health_api.eunoia.virtualpet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired; // Better response handling
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projectx.mental_health_api.eunoia.virtualpet.model.AiResponse;
import com.projectx.mental_health_api.eunoia.virtualpet.model.ChatMessage;
import com.projectx.mental_health_api.eunoia.virtualpet.repository.ChatMessageRepository;
import com.projectx.mental_health_api.eunoia.virtualpet.service.AiService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private AiService aiService;

    @Autowired
    private ChatMessageRepository chatMessageRepository; // <--- 1. INJECT REPO

    // DTO for incoming JSON
    public static class ChatRequest {

        private String message;
        private String userId; // <--- 2. ADD USER ID

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }

    // --- THE FIX: SEND & SAVE ---
    @PostMapping("/send")
    public ResponseEntity<AiResponse> sendMessage(@RequestBody ChatRequest request) {

        // Validation (Safety Check)
        String userId = request.getUserId();
        if (userId == null || userId.isEmpty()) {
            userId = "anonymous"; // Fallback if frontend fails
        }

        // 3. SAVE USER MESSAGE
        ChatMessage userMsg = new ChatMessage(request.getMessage(), true, userId);
        chatMessageRepository.save(userMsg);

        // 4. GET AI RESPONSE
        // (Assuming aiService.getResponse returns AiResponse object)
        AiResponse response = aiService.getResponse(request.getMessage());

        // 5. SAVE AI RESPONSE
        ChatMessage aiMsg = new ChatMessage(response.getReply(), false, userId);
        chatMessageRepository.save(aiMsg);

        return ResponseEntity.ok(response);
    }

    // --- BONUS: HISTORY ENDPOINT ---
    // This lets your frontend load previous chats!
    @GetMapping("/history/latest")
    public ResponseEntity<AiResponse> getLatestHistory(@RequestParam String userId) {
        List<ChatMessage> history = chatMessageRepository.findTop20ByUserIdOrderByTimestampDesc(userId);

        if (history.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Find the last message that came from the AI
        ChatMessage lastAiMsg = history.stream()
                .filter(m -> !m.isUser()) // Filter for AI messages (isUser = false)
                .findFirst()
                .orElse(null);

        if (lastAiMsg != null) {
            // Reconstruct a simple AiResponse for the frontend to display
            AiResponse res = new AiResponse();
            res.setReply(lastAiMsg.getContent());
            res.setAction("IDLE"); // Default action for history
            res.setEmotion("HAPPY");
            res.setTargetObject("NONE");
            return ResponseEntity.ok(res);
        }

        return ResponseEntity.noContent().build();
    }
}
