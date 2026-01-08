
export const SkillLevel = {
  BASIC: 'Basic',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
} as const;
export type SkillLevel = typeof SkillLevel[keyof typeof SkillLevel];

export const SkillPriority = {
  CRITICAL: 'Critical',
  IMPORTANT: 'Important',
  NICE_TO_HAVE: 'Nice-to-have'
} as const;
export type SkillPriority = typeof SkillPriority[keyof typeof SkillPriority];

export type Skill = {
  name: string;
  level: SkillLevel;
  category: string;
  confidence?: number;
  isSoftSkill?: boolean;
  source?: 'Resume' | 'GitHub' | 'Manual' | 'LinkedIn';
};

export type Project = {
  id: string;
  name: string;
  description: string;
  url?: string;
  techStack: string[];
  source: 'GitHub' | 'Manual' | 'LinkedIn';
  stars?: number;
};

export type JobOpening = {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange?: string;
  minSalary?: number; // In Lakhs for sorting/filtering
  rating?: number;    // 1-5 stars
  requiredSkills: { name: string; minLevel: SkillLevel }[];
  applyUrl: string;
  source: 'LinkedIn' | 'Indeed' | 'Company' | 'Wellfound';
  postedDate: string;
  tier: 'Best Match' | 'Skill Gap' | 'Stretch';
};

export type ApplicationRecord = {
  jobId: string;
  status: 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';
  appliedDate: string;
};

export type JobRequirement = {
  skillName: string;
  minLevel: SkillLevel;
  priority: SkillPriority;
  weight: number;
};

export type GapAnalysis = {
  skillName: string;
  status: 'Strong' | 'Partial' | 'Missing';
  currentLevel: SkillLevel | 'None';
  requiredLevel: SkillLevel;
  priority: SkillPriority;
};

export type RoadmapStep = {
  day: number;
  phase: 'Foundation' | 'Skill Building' | 'Projects' | 'Interview Readiness';
  primaryGoal: string;
  learningTask: string;
  practiceTask: string;
  buildingTask: string;
  reviewTask: string;
  expectedOutput: string;
  timeEstimate: string;
  milestone: string;
  isCompleted?: boolean;
};

export type UserProfile = {
  name: string;
  email: string;
  targetRole: string;
  currentSkills: Skill[];
  projects: Project[];
  readinessScore: number;
  interviewReadiness: number;
  streak: number;
  history: { date: string; score: number }[];
  applications?: ApplicationRecord[];
  githubUser?: string;
  linkedinUser?: string;
  completedResources?: string[]; // Format: "day-X"
};

export type JobRole = {
  id: string;
  title: string;
  description: string;
  requirements: JobRequirement[];
};

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};
