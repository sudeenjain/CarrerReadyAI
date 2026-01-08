
import { Skill, Project, RoadmapStep, ChatMessage } from './types';

export interface AnalysisProvider {
  name: string;
  
  extractSkillsFromResume(text: string): Promise<{ skills: Skill[], level: string, projects: Project[] }>;
  
  analyzeLinkedInProfile(profileText: string): Promise<{ skills: Skill[], projects: Project[] }>;
  
  analyzeGitHubRepos(repos: any[]): Promise<{ skills: Skill[], projects: Project[] }>;
  
  generateRoadmap(currentSkills: Skill[], targetRole: string): Promise<RoadmapStep[]>;

  regenerateStep(step: RoadmapStep, targetRole: string): Promise<RoadmapStep>;
  
  fetchLiveMarketPulse(role: string, location?: string): Promise<any>;
  
  getMentorAdvice(history: ChatMessage[], userProfile: string): Promise<string>;
  
  generateCoverLetter(resumeSummary: string, jobTitle: string, companyName: string): Promise<string>;
  
  getWinningStrategy(jobTitle: string, company: string, userSkills: string[]): Promise<string>;
}