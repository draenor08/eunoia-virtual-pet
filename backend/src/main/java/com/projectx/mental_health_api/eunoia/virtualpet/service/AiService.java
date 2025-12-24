package com.projectx.mental_health_api.eunoia.virtualpet.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectx.mental_health_api.eunoia.virtualpet.model.AiResponse;

@Service
public class AiService {

    @Value("${grok.api.key}") // Keeping this name so you don't have to change other files
    private String apiKey;

    // GROQ API Endpoint (OpenAI Compatible)
    private final String API_URL = "https://api.groq.com/openai/v1/chat/completions";

    // The specific model from your curl command
    private final String MODEL_NAME = "llama-3.3-70b-versatile";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String SYSTEM_PROMPT = """
        You are Eunoia, a virtual mental health companion.
        Your goal is to be empathetic, comforting, and concise.
        
        CRITICAL INSTRUCTION: You must ONLY respond in valid JSON format.
        Do not include markdown blocks (like ```json). Just the raw JSON object.
        
        The user is in a room with:
        - BED (Action: SLEEP, LIE_DOWN)
        - CHAIR (Action: SIT)
        - WATER_STATION (Action: DRINK)
        - MAT (Action: BREATHE, MEDITATE)
        
        Response Schema:
        {
            "reply": "Your spoken response here.",
            "emotion": "HAPPY | SAD | CONCERNED | CALM | EXCITED",
            "action": "IDLE | WALK | WAVE | SIT | SLEEP | DRINK | BREATHE",
            "targetObject": "NONE | BED | CHAIR | WATER_STATION | MAT"
        }
    """;

    public AiResponse getResponse(String userMessage) {
        try {
            // 1. Build Request Body (OpenAI Standard Format)
            Map<String, Object> systemMessage = Map.of("role", "system", "content", SYSTEM_PROMPT);
            Map<String, Object> userMessageJson = Map.of("role", "user", "content", userMessage);

            Map<String, Object> requestBody = Map.of(
                    "model", MODEL_NAME,
                    "messages", List.of(systemMessage, userMessageJson),
                    "temperature", 0.7 // Slightly creative but stable
            );

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            // 2. Prepare Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey); // Bearer Token is required for Groq

            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            // 3. Send Request
            ResponseEntity<String> response = restTemplate.exchange(
                    API_URL, HttpMethod.POST, entity, String.class
            );

            // 4. Parse Response (OpenAI Format)
            JsonNode root = objectMapper.readTree(response.getBody());

            // Groq/OpenAI structure: choices[0] -> message -> content
            String aiText = root.path("choices").get(0)
                    .path("message")
                    .path("content").asText();

            // 5. Clean & Convert
            // Sometimes Llama models add a little text outside the JSON. This safeguard fixes it.
            int jsonStart = aiText.indexOf("{");
            int jsonEnd = aiText.lastIndexOf("}");

            if (jsonStart != -1 && jsonEnd != -1) {
                aiText = aiText.substring(jsonStart, jsonEnd + 1);
            }

            return objectMapper.readValue(aiText, AiResponse.class);

        } catch (Exception e) {
            System.err.println("--- GROQ API ERROR ---");
            e.printStackTrace();

            return new AiResponse(
                    "I'm feeling a bit quiet right now, but I'm here.",
                    "CONCERNED", "IDLE", "NONE"
            );
        }
    }
}
