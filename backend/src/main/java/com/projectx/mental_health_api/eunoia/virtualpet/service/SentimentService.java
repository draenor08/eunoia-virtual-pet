package com.projectx.mental_health_api.eunoia.virtualpet.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;

@Service
public class SentimentService {

    // Reads your API key from application.properties
    @Value("${rapidapi.key}")
    private String apiKey;

    private static final String API_URL = "https://twinword-twinword-bundle-v1.p.rapidapi.com/sentiment_analyze/";

    public SentimentResult analyzeText(String text) {
        // --- MOCK MODE (For Testing without API Key) ---
        // If API key is missing or is the default placeholder, simulate a response.
        if (apiKey == null || apiKey.isBlank() || apiKey.contains("insert_key") || apiKey.contains("placeholder")) {
            System.out.println("⚠️ SENTIMENT MOCK MODE: Generating fake sentiment score.");

            String lower = text.toLowerCase();
            double mockScore = 0.0;
            String mockType = "neutral";

            if (lower.contains("bad") || lower.contains("sad") || lower.contains("anxious")) {
                mockScore = -0.5;
                mockType = "negative";
            } else if (lower.contains("good") || lower.contains("happy") || lower.contains("great")) {
                mockScore = 0.8;
                mockType = "positive";
            }

            return new SentimentResult(mockScore, mockType);
        }

        System.out.println("--- [DEBUG] Service: Sending text to Twinword: " + text);

        try {
            HttpResponse<JsonNode> response = Unirest.post(API_URL)
                    .header("content-type", "application/x-www-form-urlencoded")
                    .header("X-RapidAPI-Key", apiKey)
                    .header("X-RapidAPI-Host", "twinword-twinword-bundle-v1.p.rapidapi.com")
                    .fields(java.util.Map.of("text", text))
                    .asJson();

            // PROBE: Check the raw response
            System.out.println("--- [DEBUG] Service: API Status: " + response.getStatus());
            System.out.println("--- [DEBUG] Service: Raw Body: " + response.getBody());

            if (response.getStatus() == 200) {
                double score = response.getBody().getObject().getDouble("score");
                String type = response.getBody().getObject().getString("type");

                System.out.println("--- [DEBUG] Service: Parsed -> Score: " + score + " | Type: " + type);
                return new SentimentResult(score, type);
            } else {
                System.out.println("--- [DEBUG] Service: API returned non-200 status.");
            }
        } catch (Exception e) {
            System.err.println("--- [DEBUG] Service: ERROR detected: " + e.getMessage());
            e.printStackTrace();
        }

        return new SentimentResult(0.0, "neutral");
    }

    // A simple container for the data to send back to the Controller
    public record SentimentResult(double score, String type) {
    }
}