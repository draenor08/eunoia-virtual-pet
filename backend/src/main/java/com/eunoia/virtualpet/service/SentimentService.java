package com.eunoia.virtualpet.service;

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

    private static final String API_URL = "https://twinword-sentiment-analysis.p.rapidapi.com/analyze/";

    public SentimentResult analyzeText(String text) {
        try {
            // Make the actual POST request to RapidAPI
            HttpResponse<JsonNode> response = Unirest.post(API_URL)
                    .header("content-type", "application/x-www-form-urlencoded")
                    .header("X-RapidAPI-Key", apiKey)
                    .header("X-RapidAPI-Host", "twinword-sentiment-analysis.p.rapidapi.com")
                    .body("text=" + text)
                    .asJson();

            if (response.getStatus() == 200) {
                // Parse the JSON response
                // Twinword returns: { "type": "positive", "score": 0.8, ... }
                double score = response.getBody().getObject().getDouble("score");
                String type = response.getBody().getObject().getString("type");
                return new SentimentResult(score, type);
            }
        } catch (Exception e) {
            System.err.println("API Call Failed: " + e.getMessage());
        }

        // Fallback for errors or empty responses (prevents crashing)
        return new SentimentResult(0.0, "neutral");
    }

    // A simple container for the data to send back to the Controller
    public record SentimentResult(double score, String type) {}
}