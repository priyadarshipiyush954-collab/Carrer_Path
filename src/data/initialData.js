import rawData from '../../job_market_data.json';

export const jobMarketData = rawData;

export const SKILL_CATEGORIES = {
  'Python': 'Languages & Web',
  'JavaScript': 'Languages & Web',
  'HTML/CSS': 'Languages & Web',
  'React': 'Languages & Web',
  'Node.js': 'Languages & Web',
  'SQL': 'AI & Data Science',
  'Data Analysis': 'AI & Data Science',
  'Machine Learning': 'AI & Data Science',
  'Deep Learning': 'AI & Data Science',
  'Artificial Intelligence': 'AI & Data Science',
  'Cloud Computing': 'Cloud & Systems',
  'DevOps': 'Cloud & Systems',
  'Agile Methodologies': 'Cloud & Systems',
  'Blockchain': 'Cloud & Systems',
  'Communication': 'Soft Skills',
  'Critical Thinking': 'Soft Skills',
  'Problem Solving': 'Soft Skills',
  'Teamwork': 'Soft Skills',
};

export const getSkillCategory = (skillName) => {
  return SKILL_CATEGORIES[skillName] || 'Languages & Web';
};

export const parseSalary = (rangeStr) => {
  const matches = rangeStr.replace(/[^0-9-]/g, '').split('-');
  const min = matches[0] ? parseInt(matches[0], 10) : 0;
  const max = matches[1] ? parseInt(matches[1], 10) : min;
  return {
    min,
    max,
    average: Math.round((min + max) / 2),
  };
};

export const getRoleSkillMatch = (roleSkills, userSkills) => {
  const matching = roleSkills.filter((s) => userSkills.includes(s));
  const missing = roleSkills.filter((s) => !userSkills.includes(s));
  const percentage = roleSkills.length > 0 ? Math.round((matching.length / roleSkills.length) * 100) : 0;

  return {
    matching,
    missing,
    percentage,
    isComplete: percentage === 100,
  };
};
