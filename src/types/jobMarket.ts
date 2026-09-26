export interface CareerPath {
  required_skills: string[];
  salary_range: string;
  growth_rate: 'Very High' | 'High' | 'Medium' | 'Low' | string;
  education: string;
}

export interface JobMarketData {
  required_skills: string[];
  career_paths: Record<string, CareerPath>;
}

export type SkillCategory = 'Languages & Web' | 'AI & Data Science' | 'Cloud & Systems' | 'Soft Skills';

export interface CategorizedSkill {
  name: string;
  category: SkillCategory;
  iconName?: string;
  demandLevel: 'Critical' | 'High' | 'Moderate';
}
