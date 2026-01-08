
import { SkillLevel, SkillPriority, JobRole, JobOpening, UserProfile } from './types';

export const SAMPLE_JOBS: JobOpening[] = [
  // --- AMAZON CLUSTER ---
  {
    id: 'amazon-1',
    title: 'UI Developer (L5)',
    company: 'Amazon',
    location: 'Bangalore',
    salaryRange: '₹28L - ₹45L',
    minSalary: 28,
    rating: 4.5,
    requiredSkills: [
      { name: 'React', minLevel: SkillLevel.ADVANCED },
      { name: 'Tailwind CSS', minLevel: SkillLevel.ADVANCED },
      { name: 'TypeScript', minLevel: SkillLevel.INTERMEDIATE }
    ],
    applyUrl: 'https://amazon.jobs/en/jobs/sample-1',
    source: 'Company',
    postedDate: '1 day ago',
    tier: 'Best Match'
  },
  {
    id: 'amazon-2',
    title: 'Backend Engineer (SDE II)',
    company: 'Amazon',
    location: 'Hyderabad',
    salaryRange: '₹35L - ₹55L',
    minSalary: 35,
    rating: 4.5,
    requiredSkills: [
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED },
      { name: 'SQL (PostgreSQL)', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.INTERMEDIATE }
    ],
    applyUrl: 'https://amazon.jobs/en/jobs/sample-2',
    source: 'LinkedIn',
    postedDate: '3 days ago',
    tier: 'Skill Gap'
  },
  {
    id: 'amazon-3',
    title: 'Data Analyst (Retail)',
    company: 'Amazon',
    location: 'Remote',
    salaryRange: '₹18L - ₹25L',
    minSalary: 18,
    rating: 4.5,
    requiredSkills: [
      { name: 'SQL', minLevel: SkillLevel.ADVANCED },
      { name: 'Python', minLevel: SkillLevel.INTERMEDIATE },
      { name: 'Communication', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://amazon.jobs/en/jobs/sample-3',
    source: 'Indeed',
    postedDate: 'Today',
    tier: 'Best Match'
  },
  {
    id: 'amazon-4',
    title: 'Applied Scientist (AI)',
    company: 'Amazon',
    location: 'Bangalore',
    salaryRange: '₹40L - ₹75L',
    minSalary: 40,
    rating: 4.5,
    requiredSkills: [
      { name: 'Python', minLevel: SkillLevel.ADVANCED },
      { name: 'Algorithm Design', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://amazon.jobs/en/jobs/sample-4',
    source: 'Company',
    postedDate: '2 days ago',
    tier: 'Stretch'
  },

  // --- ZOMATO CLUSTER ---
  {
    id: 'zomato-1',
    title: 'Technical Lead',
    company: 'Zomato',
    location: 'Gurgaon',
    salaryRange: '₹45L - ₹75L',
    minSalary: 45,
    rating: 4.2,
    requiredSkills: [
      { name: 'Next.js', minLevel: SkillLevel.ADVANCED },
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://zomato.com/careers',
    source: 'Company',
    postedDate: 'Today',
    tier: 'Stretch'
  },
  {
    id: 'zomato-2',
    title: 'Marketing Analyst',
    company: 'Zomato',
    location: 'Gurgaon',
    salaryRange: '₹12L - ₹20L',
    minSalary: 12,
    rating: 4.2,
    requiredSkills: [
      { name: 'Communication', minLevel: SkillLevel.ADVANCED },
      { name: 'Problem Solving', minLevel: SkillLevel.INTERMEDIATE }
    ],
    applyUrl: 'https://zomato.com/careers',
    source: 'Wellfound',
    postedDate: '2 days ago',
    tier: 'Best Match'
  },
  {
    id: 'zomato-3',
    title: 'Operations Manager',
    company: 'Zomato',
    location: 'Bangalore',
    salaryRange: '₹15L - ₹28L',
    minSalary: 15,
    rating: 4.2,
    requiredSkills: [
      { name: 'Teamwork', minLevel: SkillLevel.ADVANCED },
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://zomato.com/careers',
    source: 'Company',
    postedDate: '5 days ago',
    tier: 'Best Match'
  },
  {
    id: 'zomato-4',
    title: 'Frontend Engineer (Blinkit)',
    company: 'Zomato',
    location: 'Gurgaon',
    salaryRange: '₹22L - ₹38L',
    minSalary: 22,
    rating: 4.1,
    requiredSkills: [
      { name: 'React', minLevel: SkillLevel.ADVANCED },
      { name: 'JavaScript', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://zomato.com/careers',
    source: 'LinkedIn',
    postedDate: '1 day ago',
    tier: 'Best Match'
  },

  // --- GOOGLE & MICROSOFT ---
  {
    id: 'google-1',
    title: 'Staff Software Engineer',
    company: 'Google',
    location: 'Bangalore',
    salaryRange: '₹60L - ₹1.2Cr',
    minSalary: 60,
    rating: 4.8,
    requiredSkills: [
      { name: 'JavaScript', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.ADVANCED },
      { name: 'Algorithm Design', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://google.com/careers',
    source: 'Company',
    postedDate: '1 week ago',
    tier: 'Stretch'
  },
  {
    id: 'google-2',
    title: 'Product Manager',
    company: 'Google',
    location: 'Hyderabad',
    salaryRange: '₹35L - ₹55L',
    minSalary: 35,
    rating: 4.8,
    requiredSkills: [
      { name: 'Communication', minLevel: SkillLevel.ADVANCED },
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://google.com/careers',
    source: 'Company',
    postedDate: '3 days ago',
    tier: 'Best Match'
  },
  {
    id: 'msft-1',
    title: 'Cloud Architect (Azure)',
    company: 'Microsoft',
    location: 'Hyderabad',
    salaryRange: '₹40L - ₹65L',
    minSalary: 40,
    rating: 4.6,
    requiredSkills: [
      { name: 'Docker', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://microsoft.com/careers',
    source: 'LinkedIn',
    postedDate: '2 days ago',
    tier: 'Skill Gap'
  },
  {
    id: 'msft-2',
    title: 'Security Researcher',
    company: 'Microsoft',
    location: 'Bangalore',
    salaryRange: '₹30L - ₹50L',
    minSalary: 30,
    rating: 4.6,
    requiredSkills: [
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://microsoft.com/careers',
    source: 'Indeed',
    postedDate: '5 days ago',
    tier: 'Skill Gap'
  },

  // --- SWIGGY & ZEPTO ---
  {
    id: 'zepto-1',
    title: 'Senior Frontend Engineer',
    company: 'Zepto',
    location: 'Mumbai',
    salaryRange: '₹30L - ₹45L',
    minSalary: 30,
    rating: 4.0,
    requiredSkills: [
      { name: 'React', minLevel: SkillLevel.ADVANCED },
      { name: 'Next.js', minLevel: SkillLevel.ADVANCED },
      { name: 'Tailwind CSS', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://zepto.com/careers',
    source: 'Wellfound',
    postedDate: 'Today',
    tier: 'Best Match'
  },
  {
    id: 'swiggy-1',
    title: 'Product Designer (UI/UX)',
    company: 'Swiggy',
    location: 'Bangalore',
    salaryRange: '₹18L - ₹32L',
    minSalary: 18,
    rating: 4.3,
    requiredSkills: [
      { name: 'HTML/CSS', minLevel: SkillLevel.ADVANCED },
      { name: 'Tailwind CSS', minLevel: SkillLevel.INTERMEDIATE },
      { name: 'Communication', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://swiggy.com/careers',
    source: 'LinkedIn',
    postedDate: '4 days ago',
    tier: 'Best Match'
  },
  {
    id: 'swiggy-2',
    title: 'Lead Backend Engineer',
    company: 'Swiggy',
    location: 'Bangalore',
    salaryRange: '₹35L - ₹60L',
    minSalary: 35,
    rating: 4.3,
    requiredSkills: [
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://swiggy.com/careers',
    source: 'Company',
    postedDate: 'Today',
    tier: 'Stretch'
  },

  // --- FINTECH ---
  {
    id: 'paytm-1',
    title: 'Security Engineer',
    company: 'Paytm',
    location: 'Noida',
    salaryRange: '₹28L - ₹48L',
    minSalary: 28,
    rating: 3.9,
    requiredSkills: [
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.INTERMEDIATE }
    ],
    applyUrl: 'https://paytm.com/careers',
    source: 'Company',
    postedDate: 'Today',
    tier: 'Skill Gap'
  },
  {
    id: 'razorpay-1',
    title: 'Merchant Growth Lead',
    company: 'Razorpay',
    location: 'Bangalore',
    salaryRange: '₹22L - ₹35L',
    minSalary: 22,
    rating: 4.4,
    requiredSkills: [
      { name: 'Communication', minLevel: SkillLevel.ADVANCED },
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://razorpay.com/careers',
    source: 'LinkedIn',
    postedDate: '3 days ago',
    tier: 'Best Match'
  },
  {
    id: 'cred-1',
    title: 'Backend Scalability Engineer',
    company: 'CRED',
    location: 'Bangalore',
    salaryRange: '₹35L - ₹55L',
    minSalary: 35,
    rating: 4.6,
    requiredSkills: [
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://cred.club/careers',
    source: 'Wellfound',
    postedDate: '1 day ago',
    tier: 'Skill Gap'
  },

  // --- ADDITIONAL TIER-1 ENTRIES ---
  {
    id: 'uber-1',
    title: 'Real-time Systems Engineer',
    company: 'Uber',
    location: 'Hyderabad',
    salaryRange: '₹45L - ₹70L',
    minSalary: 45,
    rating: 4.3,
    requiredSkills: [
      { name: 'System Design', minLevel: SkillLevel.ADVANCED },
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://uber.com/careers',
    source: 'Indeed',
    postedDate: '2 days ago',
    tier: 'Stretch'
  },
  {
    id: 'netflix-1',
    title: 'Streaming Infrastructure Engineer',
    company: 'Netflix',
    location: 'Remote',
    salaryRange: '₹80L - ₹1.5Cr',
    minSalary: 80,
    rating: 4.9,
    requiredSkills: [
      { name: 'System Design', minLevel: SkillLevel.ADVANCED },
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://netflix.com/jobs',
    source: 'Indeed',
    postedDate: '2 weeks ago',
    tier: 'Stretch'
  },
  {
    id: 'flipkart-1',
    title: 'Supply Chain Engineer',
    company: 'Flipkart',
    location: 'Bangalore',
    salaryRange: '₹22L - ₹36L',
    minSalary: 22,
    rating: 4.2,
    requiredSkills: [
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED },
      { name: 'SQL', minLevel: SkillLevel.INTERMEDIATE }
    ],
    applyUrl: 'https://flipkart.com/careers',
    source: 'Company',
    postedDate: 'Today',
    tier: 'Best Match'
  },
  {
    id: 'meesho-1',
    title: 'Growth Product Manager',
    company: 'Meesho',
    location: 'Remote',
    salaryRange: '₹24L - ₹40L',
    minSalary: 24,
    rating: 4.1,
    requiredSkills: [
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED },
      { name: 'Communication', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://meesho.com/careers',
    source: 'LinkedIn',
    postedDate: '3 days ago',
    tier: 'Best Match'
  },
  {
    id: 'freshworks-1',
    title: 'Customer Success Dev',
    company: 'Freshworks',
    location: 'Chennai',
    salaryRange: '₹14L - ₹22L',
    minSalary: 14,
    rating: 4.4,
    requiredSkills: [
      { name: 'JavaScript', minLevel: SkillLevel.ADVANCED },
      { name: 'Communication', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://freshworks.com/careers',
    source: 'Company',
    postedDate: '1 week ago',
    tier: 'Best Match'
  },
  {
    id: 'stripe-1',
    title: 'Payments Engineer',
    company: 'Stripe',
    location: 'Remote (Global)',
    salaryRange: '₹70L - ₹1.2Cr',
    minSalary: 70,
    rating: 4.9,
    requiredSkills: [
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED },
      { name: 'System Design', minLevel: SkillLevel.ADVANCED },
      { name: 'TypeScript', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://stripe.com/jobs',
    source: 'Company',
    postedDate: 'Today',
    tier: 'Stretch'
  },
  {
    id: 'airtel-1',
    title: 'Network Optimization Engineer',
    company: 'Airtel Xstream',
    location: 'Gurgaon',
    salaryRange: '₹18L - ₹30L',
    minSalary: 18,
    rating: 4.0,
    requiredSkills: [
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED },
      { name: 'Teamwork', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://airtel.in/careers',
    source: 'Indeed',
    postedDate: '4 days ago',
    tier: 'Best Match'
  },
  {
    id: 'adobe-1',
    title: 'Experience Designer',
    company: 'Adobe',
    location: 'Noida',
    salaryRange: '₹22L - ₹38L',
    minSalary: 22,
    rating: 4.7,
    requiredSkills: [
      { name: 'HTML/CSS', minLevel: SkillLevel.ADVANCED },
      { name: 'JavaScript', minLevel: SkillLevel.INTERMEDIATE }
    ],
    applyUrl: 'https://adobe.com/careers',
    source: 'Company',
    postedDate: '1 week ago',
    tier: 'Best Match'
  },
  {
    id: 'ola-1',
    title: 'Embedded Systems Developer',
    company: 'Ola Electric',
    location: 'Bangalore',
    salaryRange: '₹20L - ₹38L',
    minSalary: 20,
    rating: 3.7,
    requiredSkills: [
      { name: 'Problem Solving', minLevel: SkillLevel.ADVANCED },
      { name: 'Communication', minLevel: SkillLevel.INTERMEDIATE }
    ],
    applyUrl: 'https://ola.com/careers',
    source: 'Company',
    postedDate: '5 days ago',
    tier: 'Skill Gap'
  },
  {
    id: 'infosys-1',
    title: 'Lead Consultant (Full Stack)',
    company: 'Infosys Springboard',
    location: 'Pune',
    salaryRange: '₹10L - ₹18L',
    minSalary: 10,
    rating: 3.8,
    requiredSkills: [
      { name: 'React', minLevel: SkillLevel.ADVANCED },
      { name: 'Node.js', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://infosys.com/careers',
    source: 'Company',
    postedDate: '2 weeks ago',
    tier: 'Best Match'
  },
  {
    id: 'extra-30',
    title: 'Mobile Architect',
    company: 'PhonePe',
    location: 'Bangalore',
    salaryRange: '₹40L - ₹65L',
    minSalary: 40,
    rating: 4.5,
    requiredSkills: [
      { name: 'System Design', minLevel: SkillLevel.ADVANCED },
      { name: 'React', minLevel: SkillLevel.ADVANCED }
    ],
    applyUrl: 'https://phonepe.com/careers',
    source: 'LinkedIn',
    postedDate: '3 days ago',
    tier: 'Stretch'
  }
];

export const JOB_ROLES: JobRole[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Specializes in creating user-facing interfaces using modern web technologies.',
    requirements: [
      { skillName: 'React', minLevel: SkillLevel.ADVANCED, priority: SkillPriority.CRITICAL, weight: 0.2 },
      { skillName: 'TypeScript', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.CRITICAL, weight: 0.15 },
      { skillName: 'Tailwind CSS', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.IMPORTANT, weight: 0.1 },
      { skillName: 'HTML/CSS', minLevel: SkillLevel.ADVANCED, priority: SkillPriority.CRITICAL, weight: 0.1 },
      { skillName: 'JavaScript', minLevel: SkillLevel.ADVANCED, priority: SkillPriority.CRITICAL, weight: 0.15 },
      { skillName: 'Communication', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.IMPORTANT, weight: 0.1 },
      { skillName: 'Git', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.IMPORTANT, weight: 0.05 },
      { skillName: 'Teamwork', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.IMPORTANT, weight: 0.05 },
      { skillName: 'Next.js', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.IMPORTANT, weight: 0.1 },
    ]
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Focuses on server-side logic, database management, and API design.',
    requirements: [
      { skillName: 'Node.js', minLevel: SkillLevel.ADVANCED, priority: SkillPriority.CRITICAL, weight: 0.2 },
      { skillName: 'Express', minLevel: SkillLevel.ADVANCED, priority: SkillPriority.CRITICAL, weight: 0.15 },
      { skillName: 'MongoDB', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.CRITICAL, weight: 0.15 },
      { skillName: 'SQL (PostgreSQL)', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.IMPORTANT, weight: 0.1 },
      { skillName: 'Problem Solving', minLevel: SkillLevel.ADVANCED, priority: SkillPriority.CRITICAL, weight: 0.15 },
      { skillName: 'Docker', minLevel: SkillLevel.BASIC, priority: SkillPriority.IMPORTANT, weight: 0.1 },
      { skillName: 'System Design', minLevel: SkillLevel.INTERMEDIATE, priority: SkillPriority.CRITICAL, weight: 0.15 },
      { skillName: 'REST APIs', minLevel: SkillLevel.ADVANCED, priority: SkillPriority.CRITICAL, weight: 0.1 },
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Rajesh Kumar',
  email: 'rajesh@email.com',
  targetRole: 'Frontend Developer',
  currentSkills: [
    { name: 'JavaScript', level: SkillLevel.ADVANCED, category: 'Frontend', source: 'Resume' },
    { name: 'React', level: SkillLevel.INTERMEDIATE, category: 'Frontend', source: 'Resume' },
    { name: 'Node.js', level: SkillLevel.BASIC, category: 'Backend', source: 'Manual' },
    { name: 'Communication', level: SkillLevel.INTERMEDIATE, category: 'Soft Skill', source: 'Resume', isSoftSkill: true },
    { name: 'HTML/CSS', level: SkillLevel.ADVANCED, category: 'Frontend', source: 'Resume' },
    { name: 'Git', level: SkillLevel.INTERMEDIATE, category: 'Tools', source: 'GitHub' },
  ],
  projects: [
    { id: '1', name: 'E-commerce UI', description: 'Modern store front with Tailwind', techStack: ['React', 'Tailwind'], source: 'Manual' }
  ],
  readinessScore: 68,
  interviewReadiness: 72,
  streak: 1,
  history: [
    { date: '2024-03-01', score: 68 },
  ],
  applications: []
};
