
import { AnalysisProvider } from './analysisProvider';
import { Skill, SkillLevel, Project, ChatMessage, RoadmapStep } from "./types";

const SKILL_KEYWORDS = {
  'React': ['react', 'jsx', 'hooks', 'redux', 'frontend'],
  'TypeScript': ['typescript', 'ts', 'typing'],
  'JavaScript': ['javascript', 'js', 'es6'],
  'Node.js': ['node', 'express', 'backend'],
  'Tailwind CSS': ['tailwind', 'css', 'styling'],
  'MongoDB': ['mongodb', 'nosql', 'db'],
  'SQL': ['sql', 'postgres', 'mysql'],
  'Git': ['git', 'github', 'version control'],
  'Next.js': ['nextjs', 'ssr', 'ssg']
};

export class RuleBasedProvider implements AnalysisProvider {
  name = "Local Rule-Based Engine";

  async extractSkillsFromResume(text: string) {
    const found: Skill[] = [];
    const lower = text.toLowerCase();
    
    Object.entries(SKILL_KEYWORDS).forEach(([name, variants]) => {
      if (variants.some(v => lower.includes(v))) {
        found.push({
          name,
          level: SkillLevel.INTERMEDIATE,
          category: 'Technical',
          isSoftSkill: false,
          source: 'Resume'
        });
      }
    });

    return { 
      skills: found, 
      level: found.length > 5 ? 'Senior' : 'Junior', 
      projects: [] 
    };
  }

  async analyzeLinkedInProfile(text: string) {
    return this.extractSkillsFromResume(text);
  }

  async analyzeGitHubRepos(repos: any[]) {
    const skills: Skill[] = [];
    const projects: Project[] = [];
    
    repos.forEach(repo => {
      if (repo.language) {
        skills.push({
          name: repo.language,
          level: SkillLevel.INTERMEDIATE,
          category: 'Programming Language',
          source: 'GitHub'
        });
      }
      projects.push({
        id: repo.id || Math.random().toString(),
        name: repo.name,
        description: repo.description || '',
        techStack: repo.language ? [repo.language] : [],
        source: 'GitHub'
      });
    });

    return { skills, projects };
  }

  async generateRoadmap(currentSkills: Skill[], targetRole: string): Promise<RoadmapStep[]> {
    return [{
      day: 1,
      phase: 'Foundation',
      primaryGoal: "Core Fundamentals",
      learningTask: "Focus on basics (Local Fallback)",
      practiceTask: "Review documentation for " + targetRole,
      buildingTask: "Setup local development environment",
      reviewTask: "Assess baseline competency",
      expectedOutput: "Baseline assessment",
      timeEstimate: "120 mins",
      milestone: "Phase 1 Initialization"
    }];
  }

  // Updated method signature to match AnalysisProvider interface
  async regenerateStep(step: RoadmapStep, targetRole: string): Promise<RoadmapStep> {
    return { ...step, primaryGoal: step.primaryGoal + " (Regenerated for " + targetRole + ")" };
  }

  async fetchLiveMarketPulse() {
    return {
      hotSkills: ['JavaScript', 'Communication'],
      emergingTrends: ['Remote Work'],
      salaryRange: 'Competitive',
      marketOutlook: 'Positive (Local Heuristics)',
      sources: []
    };
  }

  async getMentorAdvice() {
    return "Keep practicing daily! You're doing great work.";
  }

  async generateCoverLetter() {
    return "I am writing to express my interest in this position...";
  }

  async getWinningStrategy() {
    return "1. Optimize your resume. 2. Network. 3. Be yourself.";
  }
}
