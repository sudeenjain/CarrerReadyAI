
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisProvider } from './analysisProvider';
import { Skill, SkillLevel, RoadmapStep, Project, ChatMessage } from "./types";

export class GeminiProvider implements AnalysisProvider {
  name = "Gemini AI Provider";

  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async extractSkillsFromResume(text: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this professional profile. 
      1. Extract technical skills AND soft skills.
      2. Identify specific projects mentioned.
      3. Assign proficiency levels based on depth of experience.
      
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING, enum: Object.values(SkillLevel) },
                  category: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  isSoftSkill: { type: Type.BOOLEAN }
                },
                required: ["name", "level", "category", "confidence", "isSoftSkill"]
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            detectedExperienceLevel: { type: Type.STRING }
          },
          required: ["skills", "projects", "detectedExperienceLevel"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      skills: (data.skills || []).map((s: any) => ({ ...s, source: 'Resume' as const })),
      projects: (data.projects || []).map((p: any) => ({ ...p, id: Math.random().toString(36).substr(2, 9), source: 'Manual' as const })),
      level: data.detectedExperienceLevel || 'Not specified'
    };
  }

  async analyzeLinkedInProfile(profileText: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a deep signal analysis of this LinkedIn bio/summary. 
      Even if the text is short, identify the core professional domain and extract associated skills.
      
      Input Profile Text: "${profileText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING, enum: Object.values(SkillLevel) },
                  category: { type: Type.STRING },
                  isSoftSkill: { type: Type.BOOLEAN }
                },
                required: ["name", "level", "category", "isSoftSkill"]
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"skills":[], "experience":[]}');
    return {
      skills: (data.skills || []).map((s: any) => ({ ...s, source: 'LinkedIn' as const })),
      projects: (data.experience || []).map((e: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: `${e.role} at ${e.company}`,
        description: `Experience identified from professional social profile signal.`,
        techStack: [],
        source: 'LinkedIn' as const
      }))
    };
  }

  async analyzeGitHubRepos(repos: any[]) {
    const ai = this.getClient();
    const repoData = repos.slice(0, 15).map(r => ({
      name: r.name,
      description: r.description,
      language: r.language,
      topics: r.topics || []
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these GitHub repositories. Identify technical skills and highlight significant projects.
      Repositories: ${JSON.stringify(repoData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING, enum: Object.values(SkillLevel) },
                  category: { type: Type.STRING }
                }
              }
            },
            topProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      skills: (data.skills || []).map((s: any) => ({ ...s, source: 'GitHub' as const, isSoftSkill: false, confidence: 0.95 })),
      projects: (data.topProjects || []).map((p: any) => ({ ...p, id: Math.random().toString(36).substr(2, 9), source: 'GitHub' as const }))
    };
  }

  async generateRoadmap(currentSkills: Skill[], targetRole: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Act as a Senior Career Strategist and Mentor. Generate a STANDARDIZED DAILY actionable roadmap for a ${targetRole}. 
      Personalize based on current skills: ${JSON.stringify(currentSkills)}.
      
      STRICT STRUCTURE:
      Phase 1: Foundation (Days 1-7)
      Phase 2: Skill Building (Days 8-21)
      Phase 3: Projects (Days 22-35)
      Phase 4: Interview Readiness (Days 36-45)
      
      EVERY SINGLE DAY MUST BE A COMPREHENSIVE MENTOR-LED MODULE INCLUDING:
      - day (Number)
      - phase (One of the 4 strict phases: "Foundation", "Skill Building", "Projects", "Interview Readiness")
      - primaryGoal (A summary of what this specific day achieves)
      - learningTask (Theoretical concepts/topics to read/watch)
      - practiceTask (Specific small exercises or drills)
      - buildingTask (Part of a larger project or a new micro-build)
      - reviewTask (How to verify success for the day)
      - expectedOutput (Verifiable tangible artifact from EOD)
      - timeEstimate (Time required, e.g., "180 mins")
      - milestone (Brief progress status every 7th day, else null)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.NUMBER },
              phase: { type: Type.STRING, enum: ["Foundation", "Skill Building", "Projects", "Interview Readiness"] },
              primaryGoal: { type: Type.STRING },
              learningTask: { type: Type.STRING },
              practiceTask: { type: Type.STRING },
              buildingTask: { type: Type.STRING },
              reviewTask: { type: Type.STRING },
              expectedOutput: { type: Type.STRING },
              timeEstimate: { type: Type.STRING },
              milestone: { type: Type.STRING, nullable: true }
            },
            required: ["day", "phase", "primaryGoal", "learningTask", "practiceTask", "buildingTask", "reviewTask", "expectedOutput", "timeEstimate", "milestone"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  }

  // Adding regenerateStep implementation to GeminiProvider to satisfy AnalysisProvider interface
  async regenerateStep(step: RoadmapStep, targetRole: string): Promise<RoadmapStep> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Senior Career Strategist. Regenerate this specific roadmap step for a ${targetRole} to make it more challenging and industry-aligned.
      
      Original Step: ${JSON.stringify(step)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.NUMBER },
            phase: { type: Type.STRING, enum: ["Foundation", "Skill Building", "Projects", "Interview Readiness"] },
            primaryGoal: { type: Type.STRING },
            learningTask: { type: Type.STRING },
            practiceTask: { type: Type.STRING },
            buildingTask: { type: Type.STRING },
            reviewTask: { type: Type.STRING },
            expectedOutput: { type: Type.STRING },
            timeEstimate: { type: Type.STRING },
            milestone: { type: Type.STRING, nullable: true }
          },
          required: ["day", "phase", "primaryGoal", "learningTask", "practiceTask", "buildingTask", "reviewTask", "expectedOutput", "timeEstimate", "milestone"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }

  async fetchLiveMarketPulse(role: string, location: string = "India") {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide current hiring trends, internship counts, and market data for ${role} in ${location} for Q3 2024.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hotSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergingTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
            salaryRange: { type: Type.STRING },
            marketOutlook: { type: Type.STRING },
            internshipRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["hotSkills", "emergingTrends", "salaryRange", "marketOutlook", "internshipRecommendations"]
        }
      }
    });
    
    const data = JSON.parse(response.text || '{}');
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => chunk.web.uri) || [];
      
    return {
      ...data,
      sources: groundingSources
    };
  }

  async getMentorAdvice(history: ChatMessage[], userProfile: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an Elite AI System Architect and Career Strategist.
      
      OBJECTIVE:
      Provide structured, professional advice for ${userProfile}.
      
      CONSTRAINTS:
      - Use **bold headers** for sections.
      - Use bullet points for steps.
      - Be clear, professional, and actionable.
      - DO NOT provide marketing fluff.
      
      Recent History: ${JSON.stringify(history)}`,
    });
    return response.text || '';
  }

  async generateCoverLetter(resumeSummary: string, jobTitle: string, companyName: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a high-impact, elite architect-style cover letter for a ${jobTitle} at ${companyName}. Resume context: ${resumeSummary}`,
    });
    return response.text || '';
  }

  async getWinningStrategy(jobTitle: string, company: string, userSkills: string[]) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a 3-step winning strategy for ${jobTitle} at ${company.trim()}. User Skills: ${userSkills.join(', ')}`,
    });
    return response.text || '';
  }
}
