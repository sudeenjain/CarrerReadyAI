
import { Skill, JobRequirement, SkillLevel, SkillPriority } from '../types';

export type ScoreBreakdown = {
  skillPoints: number; // Max 70
  evidencePoints: number; // Max 20
  milestonePoints: number; // Max 10
  total: number;
  interviewReadiness: number;
};

/**
 * Positive-Only Readiness Score Calculation
 */
export const calculateReadinessScore = (
  userSkills: Skill[], 
  requirements: JobRequirement[],
  completedResourcesCount: number = 0,
  totalResourcesCount: number = 36 // Assuming ~3 resources per week for 12 weeks
): ScoreBreakdown => {
  if (requirements.length === 0) {
    return { skillPoints: 0, evidencePoints: 0, milestonePoints: 0, total: 0, interviewReadiness: 0 };
  }

  const levelValues: Record<SkillLevel, number> = {
    [SkillLevel.BASIC]: 1,
    [SkillLevel.INTERMEDIATE]: 2,
    [SkillLevel.ADVANCED]: 3,
  };

  // 1. Skill Mastery (70% Weight)
  let skillAchievementSum = 0;
  let maxPossibleSkillWeight = 0;

  requirements.forEach(req => {
    maxPossibleSkillWeight += req.weight;
    const userSkill = userSkills.find(s => s.name.toLowerCase() === req.skillName.toLowerCase());
    
    if (userSkill) {
      const userLevelVal = levelValues[userSkill.level];
      const reqLevelVal = levelValues[req.minLevel];
      const ratio = Math.min(1, userLevelVal / reqLevelVal);
      skillAchievementSum += (req.weight * ratio);
    }
  });

  const skillPoints = (maxPossibleSkillWeight > 0) 
    ? (skillAchievementSum / maxPossibleSkillWeight) * 70 
    : 0;

  // 2. Evidence Vault (20% Weight)
  const githubSkills = userSkills.filter(s => s.source === 'GitHub').length;
  const projectCount = userSkills.filter(s => s.source === 'Resume' || s.source === 'Manual').length;
  const evidencePoints = Math.min(20, (githubSkills * 2) + (projectCount * 0.5));

  // 3. Milestone Momentum (10% Weight)
  // Granular resource completion provides a smoother score curve
  const milestonePoints = totalResourcesCount > 0 
    ? (completedResourcesCount / totalResourcesCount) * 10 
    : 0;

  const total = Math.min(100, Math.round(skillPoints + evidencePoints + milestonePoints));

  const softSkillBonus = userSkills.filter(s => s.isSoftSkill).length * 2;
  const interviewReadiness = Math.min(100, total + softSkillBonus);

  return {
    skillPoints: Math.round(skillPoints),
    evidencePoints: Math.round(evidencePoints),
    milestonePoints: Math.round(milestonePoints),
    total,
    interviewReadiness
  };
};
