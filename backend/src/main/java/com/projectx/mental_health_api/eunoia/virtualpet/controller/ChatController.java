package com.projectx.mental_health_api.eunoia.virtualpet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectx.mental_health_api.eunoia.virtualpet.model.AiResponse;
import com.projectx.mental_health_api.eunoia.virtualpet.service.AiService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if your frontend port differs
public class ChatController {

    @Autowired
    private AiService aiService;

    @PostMapping
    public AiResponse chat(@RequestBody String message) {
        // This receives the raw text from frontend and asks the AI
        return aiService.getResponse(message);
    }
}