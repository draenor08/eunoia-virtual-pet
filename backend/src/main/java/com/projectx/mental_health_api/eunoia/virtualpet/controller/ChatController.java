package com.projectx.mental_health_api.eunoia.virtualpet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin; // Simplified imports
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectx.mental_health_api.eunoia.virtualpet.model.AiResponse;
import com.projectx.mental_health_api.eunoia.virtualpet.service.AiService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private AiService aiService;

    // 1. DTO Class to handle the incoming JSON safely
    // React sends: { "message": "Hello" }
    public static class ChatRequest {

        private String message;

        // Getters and Setters are required for JSON parsing
        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // 2. Updated Route to match Frontend ("/send")
    @PostMapping("/send")
    public AiResponse chat(@RequestBody ChatRequest request) {
        // 3. Extract the actual text from the JSON object
        return aiService.getResponse(request.getMessage());
    }
}
