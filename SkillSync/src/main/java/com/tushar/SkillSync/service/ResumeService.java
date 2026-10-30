package com.tushar.SkillSync.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tushar.SkillSync.entity.Resume;
import com.tushar.SkillSync.entity.ResumeAnalysis;
import com.tushar.SkillSync.entity.User;
import com.tushar.SkillSync.repository.ResumeAnalysisRepository;
import com.tushar.SkillSync.repository.ResumeRepository;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class ResumeService {

    private final Tika tika = new Tika();
    private final GeminiAiService geminiAiService;
    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository analysisRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeService(GeminiAiService geminiAiService,
                         ResumeRepository resumeRepository,
                         ResumeAnalysisRepository analysisRepository) {
        this.geminiAiService = geminiAiService;
        this.resumeRepository = resumeRepository;
        this.analysisRepository = analysisRepository;
    }

    public String extractText(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded resume file is empty.");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String lower = originalFilename.toLowerCase();
            if (!lower.endsWith(".pdf") && !lower.endsWith(".doc") && !lower.endsWith(".docx")
                    && !lower.endsWith(".txt") && !lower.endsWith(".rtf")) {
                throw new IllegalArgumentException("Unsupported file type. Please upload a PDF, DOCX, DOC, TXT, or RTF file.");
            }
        }
        return tika.parseToString(file.getInputStream());
    }

    @Transactional
    public Map<String, Object> analyzeResume(MultipartFile file, User user) throws Exception {
        String content = extractText(file);

        String prompt = """
        Analyze this resume text:

        %s

        Return ONLY valid JSON.
        Do not return markdown.
        Do not use ```json.

        JSON format:
        {
          "keySkills": [],
          "resumeQuality": 0,
          "improvements": [],
          "summary": ""
        }

        Rules:
        - keySkills must be array of strings
        - resumeQuality must be number from 1-10
        - improvements must be array of plain strings
        - give exactly 3 improvements

        Example:
        {
          "keySkills": ["Java", "Spring Boot"],
          "resumeQuality": 8,
          "improvements": [
            "Add measurable achievements",
            "Improve project descriptions",
            "Add stronger summary section"
          ],
          "summary": "Strong backend profile with microservices experience"
        }
        """.formatted(content);

        String aiResponse = geminiAiService.generate(prompt);

        // Persist resume and analysis
        try {
            Resume resume = new Resume(
                    user,
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf",
                    file.getContentType(),
                    file.getSize(),
                    content
            );
            resume = resumeRepository.save(resume);

            ResumeAnalysis analysis = new ResumeAnalysis();
            analysis.setUser(user);
            analysis.setResume(resume);
            analysis.setAnalysisType("RESUME_REVIEW");

            JsonNode root = objectMapper.readTree(aiResponse);
            if (root.has("resumeQuality")) {
                analysis.setScore(root.get("resumeQuality").asInt());
            }
            if (root.has("keySkills")) {
                analysis.setKeySkillsJson(root.get("keySkills").toString());
            }
            if (root.has("improvements")) {
                analysis.setImprovementsJson(root.get("improvements").toString());
            }
            if (root.has("summary")) {
                analysis.setSummary(root.get("summary").asText());
            }

            analysisRepository.save(analysis);
        } catch (Exception e) {
            // Log persistence error without failing user response
            System.err.println("Could not persist resume analysis: " + e.getMessage());
        }

        return Map.of("analysis", aiResponse);
    }

    @Transactional
    public Map<String, Object> analyzeATS(MultipartFile file, String jobDescription, User user) throws Exception {
        String resumeText = extractText(file);

        String prompt = """
        You are an expert ATS analyzer. Compare the resume and job description.

        ----
        Resume:
        %s
        ----
        Job Description:
        %s
        ----

        Analyze and return a structured JSON with:
        1. "atsScore" (number 0-100)
        2. "matchedKeywords" (list of strings)
        3. "missingKeywords" (list of strings)
        4. "summary" (short paragraph explaining the fit)

        keep response strictly valid json.
        """.formatted(resumeText, jobDescription);

        String aiResponse = geminiAiService.generate(prompt);

        try {
            Resume resume = new Resume(
                    user,
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf",
                    file.getContentType(),
                    file.getSize(),
                    resumeText
            );
            resume = resumeRepository.save(resume);

            ResumeAnalysis analysis = new ResumeAnalysis();
            analysis.setUser(user);
            analysis.setResume(resume);
            analysis.setAnalysisType("ATS_CHECK");
            analysis.setJobDescription(jobDescription);

            JsonNode root = objectMapper.readTree(aiResponse);
            if (root.has("atsScore")) {
                analysis.setScore(root.get("atsScore").asInt());
            }
            if (root.has("matchedKeywords")) {
                analysis.setMatchedKeywordsJson(root.get("matchedKeywords").toString());
            }
            if (root.has("missingKeywords")) {
                analysis.setMissingKeywordsJson(root.get("missingKeywords").toString());
            }
            if (root.has("summary")) {
                analysis.setSummary(root.get("summary").asText());
            }

            analysisRepository.save(analysis);
        } catch (Exception e) {
            System.err.println("Could not persist ATS analysis: " + e.getMessage());
        }

        return Map.of("atsReport", aiResponse);
    }

    public List<Resume> getUserResumes(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }

    public List<ResumeAnalysis> getUserAnalyses(Long userId) {
        return analysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Map<String, Object> getAiStatus() {
        return geminiAiService.checkStatus();
    }
}
