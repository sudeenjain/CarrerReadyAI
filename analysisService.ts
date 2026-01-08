
import { GeminiProvider } from './geminiProvider';
import { RuleBasedProvider } from './ruleBasedProvider';
import { AnalysisProvider } from './analysisProvider';
import { RoadmapStep } from './types';

class AnalysisService {
  private primary: AnalysisProvider;
  private fallback: AnalysisProvider;

  constructor() {
    this.primary = new GeminiProvider();
    this.fallback = new RuleBasedProvider();
  }

  async execute<T>(action: (p: AnalysisProvider) => Promise<T>): Promise<T> {
    try {
      return await action(this.primary);
    } catch (err) {
      console.warn(`Primary Provider (${this.primary.name}) failed. Falling back to ${this.fallback.name}.`, err);
      return await action(this.fallback);
    }
  }

  async extractSkillsFromResume(text: string) {
    return this.execute(p => p.extractSkillsFromResume(text));
  }

  async analyzeLinkedInProfile(text: string) {
    return this.execute(p => p.analyzeLinkedInProfile(text));
  }

  async analyzeGitHubRepos(repos: any[]) {
    return this.execute(p => p.analyzeGitHubRepos(repos));
  }

  async generateRoadmap(skills: any, role: string) {
    return this.execute(p => p.generateRoadmap(skills, role));
  }

  async regenerateStep(step: RoadmapStep, role: string) {
    return this.execute(p => p.regenerateStep(step, role));
  }

  async fetchLiveMarketPulse(role: string) {
    return this.execute(p => p.fetchLiveMarketPulse(role));
  }

  async getMentorAdvice(history: any, profile: string) {
    return this.execute(p => p.getMentorAdvice(history, profile));
  }

  async generateCoverLetter(resume: string, title: string, company: string) {
    return this.execute(p => p.generateCoverLetter(resume, title, company));
  }

  async getWinningStrategy(title: string, company: string, skills: string[]) {
    return this.execute(p => p.getWinningStrategy(title, company, skills));
  }
}

export const analysisService = new AnalysisService();