package com.projectx.mental_health_api.eunoia.virtualpet.model;

public class AiResponse {
    private String reply;
    private String emotion;
    private String action;
    private String targetObject;

    // Empty constructor for Jackson deserialization
    public AiResponse() {}

    public AiResponse(String reply, String emotion, String action, String targetObject) {
        this.reply = reply;
        this.emotion = emotion;
        this.action = action;
        this.targetObject = targetObject;
    }

    // Getters and Setters
    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetObject() { return targetObject; }
    public void setTargetObject(String targetObject) { this.targetObject = targetObject; }
}