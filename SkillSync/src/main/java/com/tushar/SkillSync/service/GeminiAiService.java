package com.tushar.SkillSync.service;

import com.google.genai.Client;
import com.google.genai.types.Model;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatProperties;
import org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiConnectionProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GeminiAiService {

    private final ChatClient chatClient;
    private final Client genAiClient;
    private final GoogleGenAiConnectionProperties connectionProperties;
    private final GoogleGenAiChatProperties chatProperties;
    private final Environment environment;

    public GeminiAiService(ChatClient.Builder chatClientBuilder,
                           ObjectProvider<Client> genAiClientProvider,
                           ObjectProvider<GoogleGenAiConnectionProperties> connectionPropertiesProvider,
                           ObjectProvider<GoogleGenAiChatProperties> chatPropertiesProvider,
                           Environment environment) {
        this.chatClient = chatClientBuilder.build();
        this.genAiClient = genAiClientProvider.getIfAvailable();
        this.connectionProperties = connectionPropertiesProvider.getIfAvailable();
        this.chatProperties = chatPropertiesProvider.getIfAvailable();
        this.environment = environment;
    }

    public String getApiKey() {
        if (connectionProperties != null && connectionProperties.getApiKey() != null) {
            String key = connectionProperties.getApiKey().trim().replaceAll("^\"|\"$|^'|'$", "");
            if (!key.isBlank()) {
                return key;
            }
        }
        if (environment != null) {
            String[] possibleKeys = {
                "spring.ai.google.genai.api-key",
                "GEMINI_API_KEY",
                "GOOGLE_API_KEY",
                "spring.ai.gemini.api-key",
                "google.ai.gemini.api-key"
            };
            for (String prop : possibleKeys) {
                String val = environment.getProperty(prop);
                if (val != null) {
                    val = val.trim().replaceAll("^\"|\"$|^'|'$", "");
                    if (!val.isBlank()) {
                        return val;
                    }
                }
            }
        }
        return "";
    }

    public String getModelName() {
        if (chatProperties != null && chatProperties.getModel() != null && !chatProperties.getModel().isBlank()) {
            return chatProperties.getModel();
        }
        if (environment != null) {
            String envModel = environment.getProperty("spring.ai.google.genai.chat.model");
            if (envModel != null && !envModel.isBlank()) {
                return envModel;
            }
        }
        return "gemini-1.5-flash";
    }

    public Map<String, Object> getModelSourceDetails() {
        Map<String, Object> details = new LinkedHashMap<>();
        String envGeminiModel = System.getenv("GEMINI_MODEL");
        String envSpringAiModel = System.getenv("SPRING_AI_GOOGLE_GENAI_CHAT_MODEL");
        String propModel = environment != null ? environment.getProperty("spring.ai.google.genai.chat.model") : null;
        String boundModel = chatProperties != null ? chatProperties.getModel() : null;

        details.put("effectiveModel", getModelName());
        if (envGeminiModel != null && !envGeminiModel.isBlank()) {
            details.put("source", "environment variable (GEMINI_MODEL)");
            details.put("sourceValue", envGeminiModel);
        } else if (envSpringAiModel != null && !envSpringAiModel.isBlank()) {
            details.put("source", "environment variable (SPRING_AI_GOOGLE_GENAI_CHAT_MODEL)");
            details.put("sourceValue", envSpringAiModel);
        } else if (propModel != null && !propModel.isBlank()) {
            details.put("source", "application.properties (spring.ai.google.genai.chat.model)");
            details.put("sourceValue", propModel);
        } else if (boundModel != null && !boundModel.isBlank()) {
            details.put("source", "GoogleGenAiChatProperties binding");
            details.put("sourceValue", boundModel);
        } else {
            details.put("source", "default fallback");
            details.put("sourceValue", "gemini-1.5-flash");
        }
        return details;
    }

    public List<String> getSupportedModels() {
        if (!isConfigured() || genAiClient == null) {
            return Collections.emptyList();
        }
        try {
            List<String> list = new ArrayList<>();
            for (Model m : genAiClient.models.list(null)) {
                String name = m.name().orElse("");
                if (name.startsWith("models/")) {
                    name = name.substring(7);
                }
                boolean supportsGenerate = m.supportedActions()
                        .map(actions -> actions.contains("generateContent"))
                        .orElse(true);
                if (supportsGenerate && name.toLowerCase().contains("gemini")) {
                    list.add(name);
                }
            }
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public boolean isConfigured() {
        String key = getApiKey();
        return !key.isBlank() 
                && !key.equalsIgnoreCase("your_api_key_here") 
                && !key.equals("dummy-gemini-key-for-local-startup")
                && !key.startsWith("dummy-");
    }

    public String sanitizeErrorMessage(String error) {
        if (error == null) return "";
        String sanitized = error;
        String currentKey = getApiKey();
        if (!currentKey.isBlank()) {
            sanitized = sanitized.replace(currentKey, "[REDACTED_API_KEY]");
        }
        sanitized = sanitized.replaceAll("(?i)(key|apikey|api-key)=[^&\\s]+", "$1=[REDACTED]");
        sanitized = sanitized.replaceAll("AIza[0-9A-Za-z-_]{35}", "[REDACTED]");
        sanitized = sanitized.replaceAll("AQ\\.[0-9A-Za-z-_]{40,}", "[REDACTED]");
        return sanitized;
    }

    public Map<String, Object> checkStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        boolean configured = isConfigured();
        status.put("configured", configured);
        status.put("model", getModelName());
        status.put("modelSource", getModelSourceDetails());

        if (!configured) {
            status.put("connected", false);
            status.put("message", "Gemini API key is not configured.");
            return status;
        }

        List<String> supportedModels = getSupportedModels();
        if (!supportedModels.isEmpty()) {
            status.put("supportedModels", supportedModels);
        }

        try {
            String testResponse = chatClient.prompt().user("Respond with the single word: OK").call().content();
            status.put("connected", true);
            status.put("message", "Google Gemini AI is connected and working successfully!");
            status.put("sampleResponse", testResponse != null ? testResponse.trim() : "OK");
        } catch (Exception e) {
            StringBuilder details = new StringBuilder();
            Throwable curr = e;
            while (curr != null) {
                if (curr.getMessage() != null && !curr.getMessage().isBlank()) {
                    if (details.length() > 0) details.append(" -> ");
                    details.append(curr.getClass().getSimpleName()).append(": ").append(curr.getMessage());
                }
                curr = curr.getCause();
            }
            String sanitizedErr = sanitizeErrorMessage(details.toString());
            String lower = sanitizedErr.toLowerCase();

            status.put("connected", false);
            status.put("errorDetails", sanitizedErr);

            if (lower.contains("api_key_invalid") || lower.contains("invalid api key") || lower.contains("401") || lower.contains("403") || lower.contains("api key not valid")) {
                status.put("message", "Google Gemini API key appears to be invalid or unauthorized. Please verify your key at https://aistudio.google.com/app/apikey.");
            } else if (lower.contains("429") || lower.contains("quota") || lower.contains("rate limit") || lower.contains("resource_exhausted")) {
                status.put("message", "Google Gemini API rate limit or quota exceeded. Please wait a moment and try again.");
            } else if (lower.contains("not found") || lower.contains("404")) {
                String modelMsg = "Configured Gemini model '" + getModelName() + "' was not found by Google Gemini API (HTTP 404).";
                if (!supportedModels.isEmpty()) {
                    modelMsg += " Models supported for your key: " + String.join(", ", supportedModels);
                } else {
                    modelMsg += " Please configure a supported model such as 'gemini-1.5-flash' or 'gemini-2.0-flash'.";
                }
                status.put("message", modelMsg);
            } else {
                status.put("message", "Google Gemini API error: " + sanitizedErr);
            }
        }
        return status;
    }

    public String generate(String prompt) {
        if (!isConfigured()) {
            throw new IllegalStateException(
                "Gemini API key is not configured. Please paste your Gemini API key in 'SkillSync/src/main/resources/application.properties' under 'spring.ai.google.genai.api-key' and restart the backend."
            );
        }

        try {
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            if (response == null || response.isBlank()) {
                throw new IllegalStateException("Received empty response from Google Gemini AI.");
            }

            return cleanJsonResponse(response);
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            StringBuilder details = new StringBuilder();
            Throwable curr = e;
            while (curr != null) {
                if (curr.getMessage() != null && !curr.getMessage().isBlank()) {
                    if (details.length() > 0) details.append(" -> ");
                    details.append(curr.getClass().getSimpleName()).append(": ").append(curr.getMessage());
                }
                curr = curr.getCause();
            }
            String sanitizedErr = sanitizeErrorMessage(details.toString());
            String lower = sanitizedErr.toLowerCase();

            if (lower.contains("api_key_invalid") || lower.contains("invalid api key") || lower.contains("401") || lower.contains("403") || lower.contains("api key not valid")) {
                throw new IllegalStateException("Your Gemini API key appears to be invalid or unauthorized. Please verify your key at https://aistudio.google.com/ and update application.properties.");
            }
            if (lower.contains("429") || lower.contains("quota") || lower.contains("rate limit") || lower.contains("resource_exhausted")) {
                throw new IllegalStateException("Gemini API rate limit or quota exceeded. Please wait a moment and try again.");
            }
            if (lower.contains("not found") || lower.contains("404")) {
                List<String> available = getSupportedModels();
                String hint = available.isEmpty() ? "" : " (Supported models for your key: " + String.join(", ", available) + ")";
                throw new IllegalStateException("Configured Gemini model ('" + getModelName() + "') was not found by Google Gemini API." + hint);
            }

            throw new RuntimeException("Gemini AI generation failed: " + sanitizedErr, e);
        }
    }

    public static String cleanJsonResponse(String raw) {
        if (raw == null) return "{}";
        String cleaned = raw.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}
