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

    @Value("${groq.api.key}") // Keeping this name so you don't have to change other files
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
                    "targetObject": "NONE | BED | CHAIR | WATER_STATION | MAT",
                    "recommendedFilter": "NONE | BREATHING | GROUNDING | RELAXATION | MINDFULNESS | ANXIOUS | LOW | OVERWHELMED"
                }

                LOGIC FOR RECOMMENDED FILTER:
                - If user is stressed/tense -> "RELAXATION" or "BREATHE"
                - If user is sad/low/depressed -> "JOURNALING" or "CBT" or "MINDFULNESS"
                - If user is anxious/panicked -> "BREATHE" or "GROUNDING" or "ANXIOUS"
                - If user is overwhelmed -> "GROUNDING" or "MEDITATION"
                - If user needs sleep/rest -> "RELAXATION" or "MEDITATION"
                - If user has negative thoughts -> "CBT"
                - If user is HAPPY/POSITIVE -> "NONE" (Do not force exercises)
                - Default -> "NONE"

                VALID CATEGORIES: BREATHING, GROUNDING, MINDFULNESS, RELAXATION, CBT, JOURNALING, MEDITATION, ANXIOUS, LOW, OVERWHELMED.
                GREETING INSTRUCTION:
                If the user says "Hello", "Hi", or starts a conversation, respond with a warm, friendly greeting like "Hello! I'm Euna, your friend. How are you feeling right now?" or "Hi there! I'm here for you. What's on your mind?".
            """;

    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("=================================================");
        System.out.println("🤖 AiService Initialized");
        boolean hasKey = apiKey != null && !apiKey.isBlank();
        System.out.println("🔑 GROQ_API_KEY Loaded: " + (hasKey ? "YES (Length: " + apiKey.length() + ")" : "NO ❌"));
        System.out.println("=================================================");
    }

    public AiResponse getResponse(String userMessage) {
        // --- MOCK MODE (For Testing without API Key) ---
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("insert_your_key_here")) {
            System.out.println("⚠️ MOCK MODE: Generating fake AI response (No API Key found)");

            String msg = userMessage.toLowerCase();
            if (msg.contains("anxious") || msg.contains("panic") || msg.contains("worry")) {
                return new AiResponse(
                        "I hear you. Taking deep breaths can really help with anxiety. Let's try some breathing exercises together.",
                        "SAD", "BREATHE", "MAT", "BREATHING");
            } else if (msg.contains("sad") || msg.contains("low") || msg.contains("depress")) {
                return new AiResponse(
                        "I am sorry you are feeling down. Journaling your thoughts might help get them out.",
                        "SAD", "IDLE", "BED", "JOURNALING");
            } else if (msg.contains("stress") || msg.contains("tense")) {
                return new AiResponse(
                        "It sounds like you're carrying a lot of tension. Let's try to relax your muscles.",
                        "CONCERNED", "SIT", "CHAIR", "RELAXATION");
            } else if (msg.contains("overwhelm")) {
                return new AiResponse(
                        "Let's take it one step at a time. Grounding yourself can help bring you back to the present.",
                        "CONCERNED", "SIT", "MAT", "GROUNDING");
            } else if (msg.contains("negative") || msg.contains("thought")) {
                return new AiResponse(
                        "Challenging those negative thoughts can be helpful. Let's try some Cognitive Reframing.",
                        "CONCERNED", "IDLE", "CHAIR", "CBT");
            } else if (msg.contains("sleep") || msg.contains("rest") || msg.contains("tired") || msg.contains("nap")) {
                return new AiResponse(
                        "Rest is important. I'm going to take a quick nap too.",
                        "CALM", "SLEEP", "BED", "NONE"); // No filter, just sleep
            } else if (msg.contains("drink") || msg.contains("water") || msg.contains("thirsty")) {
                return new AiResponse(
                        "Hydration is key! Let's get some water.",
                        "HAPPY", "DRINK", "WATER_STATION", "NONE");
            } else if (msg.contains("happy") || msg.contains("good") || msg.contains("great") || msg.contains("love")) {
                return new AiResponse(
                        "That is wonderful! I love seeing you happy! Keep shining!",
                        "EXCITED", "HAPPY", "NONE", "NONE");
            } else if (msg.contains("hello") || msg.contains("hi")) {
                return new AiResponse(
                        "Hello! I'm Euna, your friend. How are you feeling right now?",
                        "HAPPY", "WAVE", "NONE", "NONE");
            } else {
                return new AiResponse(
                        "I am here for you! (Mock Mode active)",
                        "HAPPY", "IDLE", "NONE", "NONE");
            }
        }

        try {
            // 1. Build Request Body
            Map<String, Object> systemMessage = Map.of("role", "system", "content", SYSTEM_PROMPT);
            Map<String, Object> userMessageJson = Map.of("role", "user", "content", userMessage);

            Map<String, Object> requestBody = Map.of(
                    "model", MODEL_NAME,
                    "messages", List.of(systemMessage, userMessageJson),
                    "temperature", 0.7);

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            // 2. Prepare Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            // 3. Send Request
            ResponseEntity<String> response = restTemplate.exchange(
                    API_URL, HttpMethod.POST, entity, String.class);

            // 4. Parse Response
            JsonNode root = objectMapper.readTree(response.getBody());

            String aiText = root.path("choices").get(0)
                    .path("message")
                    .path("content").asText();

            // 5. Clean & Convert
            int jsonStart = aiText.indexOf("{");
            int jsonEnd = aiText.lastIndexOf("}");

            if (jsonStart != -1 && jsonEnd != -1) {
                aiText = aiText.substring(jsonStart, jsonEnd + 1);
            }

            return objectMapper.readValue(aiText, AiResponse.class);

        } catch (Exception e) {
            System.err.println("--- GROQ API ERROR ---");
            System.err.println("Message: " + e.getMessage());
            if (apiKey == null || apiKey.isBlank()) {
                System.err.println("⚠️ WARNING: GROQ_API_KEY is missing or empty!");
            }
            e.printStackTrace();

            // DEBUG: Return the actual error to the user
            return new AiResponse(
                    "DEBUG ERROR: " + e.getMessage(),
                    "CONCERNED", "IDLE", "NONE");
        }
    }
}
