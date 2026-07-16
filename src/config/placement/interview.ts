export interface InterviewQuestion {
  id: string;
  question: string;
  tips: string[];
  sampleAnswer?: string;
}

export interface InterviewSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questions: InterviewQuestion[];
}

export interface CompanyPattern {
  company: string;
  logo: string;
  difficulty: 'medium' | 'hard' | 'very-hard';
  rounds: string[];
  tips: string[];
}

export interface StarStep {
  step: string;
  description: string;
  example: string;
}

export interface ResumeTipSection {
  category: string;
  tips: string[];
}

export const interviewSections: InterviewSection[] = [
  {
    id: 'hr',
    title: 'HR & Introductory',
    description: 'Common screening questions asked in the first round',
    icon: 'User',
    color: '#60a5fa',
    questions: [
      {
        id: 'hr-1',
        question: 'Tell me about yourself.',
        tips: [
          'Follow the Present-Past-Future formula: current role → relevant past → future goals',
          'Keep it under 2 minutes, focused on professional background',
          'Tailor it to the role — highlight relevant skills and achievements',
          'End with why you\'re excited about this specific opportunity',
        ],
        sampleAnswer: 'I\'m a final-year CS student at XYZ University. I\'ve been building full-stack applications for the past two years, interned at ABC where I optimized their search service reducing latency by 40%. I\'m particularly interested in distributed systems which is why this backend role at your company excites me.',
      },
      {
        id: 'hr-2',
        question: 'Why do you want to work here?',
        tips: [
          'Research the company\'s products, culture, and recent news',
          'Connect your skills/interests to their specific challenges',
          'Be genuine — mention specific projects or values that attract you',
          'Show you\'ve done your homework — reference recent launches or blog posts',
        ],
      },
      {
        id: 'hr-3',
        question: 'What are your strengths and weaknesses?',
        tips: [
          'Strengths: Pick 2-3 relevant to the role with concrete examples',
          'Weaknesses: Choose a genuine one, then explain how you\'re improving',
          'Never say "I work too hard" or "I\'m a perfectionist" — interviewers see through it',
          'Frame weakness as growth area: "I used to struggle with X, so I started doing Y"',
        ],
      },
      {
        id: 'hr-4',
        question: 'Where do you see yourself in 5 years?',
        tips: [
          'Show ambition aligned with the company\'s growth trajectory',
          'Focus on skills you want to develop, not titles you want to hold',
          'Demonstrate commitment — they want to know you\'ll stay',
          'Be realistic but aspirational',
        ],
      },
      {
        id: 'hr-5',
        question: 'Why should we hire you?',
        tips: [
          'Summarize your unique value proposition in 3 points',
          'Connect your experience directly to their needs',
          'Mention something you bring that other candidates might not',
          'Be confident but not arrogant — back claims with evidence',
        ],
      },
      {
        id: 'hr-6',
        question: 'What is your expected salary?',
        tips: [
          'Research market rate on Glassdoor, Levels.fyi for the role and location',
          'Give a range rather than a single number',
          'If pressed early, say "I\'d like to learn more about the role first"',
          'For freshers: focus on the opportunity and learning; salary is usually standardized',
        ],
      },
      {
        id: 'hr-7',
        question: 'Do you have any questions for us?',
        tips: [
          'Always have 2-3 prepared questions — saying "no" signals disinterest',
          'Ask about team structure, tech stack, growth opportunities',
          'Good ones: "What does a typical day look like?", "What\'s the biggest challenge the team faces?"',
          'Avoid asking about salary/benefits in initial screening rounds',
        ],
      },
    ],
  },
  {
    id: 'behavioral',
    title: 'Behavioral (STAR)',
    description: 'Experience-based questions — use STAR method to answer',
    icon: 'MessageCircle',
    color: '#a78bfa',
    questions: [
      {
        id: 'beh-1',
        question: 'Tell me about a time you faced a difficult problem and how you solved it.',
        tips: [
          'Pick a technical challenge with measurable outcome',
          'Show your problem-solving process, not just the answer',
          'Mention what you learned and how it changed your approach',
          'Use STAR: Situation → Task → Action → Result',
        ],
        sampleAnswer: 'During my internship, our API was timing out under load (Situation). I was tasked with finding the bottleneck (Task). I profiled the code, found N+1 queries, and implemented batch loading with Redis caching (Action). Response time dropped from 3s to 200ms, handling 10x more concurrent users (Result).',
      },
      {
        id: 'beh-2',
        question: 'Describe a situation where you had to work with a difficult team member.',
        tips: [
          'Never blame the other person — focus on how YOU handled it',
          'Show empathy and communication skills',
          'Highlight the positive outcome or what you learned',
          'Demonstrate emotional intelligence and professionalism',
        ],
      },
      {
        id: 'beh-3',
        question: 'Tell me about a time you failed.',
        tips: [
          'Choose a genuine failure, not a humble-brag',
          'Focus 70% on what you learned and changed, 30% on the failure',
          'Show self-awareness and growth mindset',
          'Demonstrate that you take responsibility, not deflect blame',
        ],
      },
      {
        id: 'beh-4',
        question: 'How do you handle tight deadlines?',
        tips: [
          'Give a specific example with timeline pressure',
          'Show how you prioritize, delegate, and communicate',
          'Mention tools/techniques you use (task breakdown, time-boxing)',
          'Highlight a successful delivery under pressure',
        ],
      },
      {
        id: 'beh-5',
        question: 'Describe a project you\'re most proud of.',
        tips: [
          'Pick something technically impressive or impactful',
          'Explain your specific contributions clearly',
          'Mention the tech stack and architecture decisions',
          'Quantify the impact: users, performance improvement, revenue',
        ],
      },
      {
        id: 'beh-6',
        question: 'How do you handle feedback or criticism?',
        tips: [
          'Show you actively seek feedback (code reviews, 1:1s)',
          'Give an example of feedback that changed your approach',
          'Demonstrate humility — you don\'t get defensive',
          'Mention how you\'ve given constructive feedback to others',
        ],
      },
      {
        id: 'beh-7',
        question: 'Tell me about a time you took initiative beyond your assigned work.',
        tips: [
          'Shows leadership potential and ownership',
          'Pick something that added real value to the team/project',
          'Explain why you took initiative and the outcome',
          'Don\'t make it sound like you ignored your actual responsibilities',
        ],
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical & System Design',
    description: 'Questions about your technical approach and thinking',
    icon: 'Code',
    color: '#34d399',
    questions: [
      {
        id: 'tech-1',
        question: 'Explain a complex technical concept to a non-technical person.',
        tips: [
          'Use analogies from everyday life',
          'Start with the "why" before the "how"',
          'Avoid jargon — if you must use a term, define it immediately',
          'Check understanding along the way',
        ],
      },
      {
        id: 'tech-2',
        question: 'How do you approach debugging a production issue?',
        tips: [
          'Reproduce → Isolate → Root cause → Fix → Verify → Postmortem',
          'Mention specific tools: logs, metrics, debuggers, profilers',
          'Emphasize communication — update stakeholders early',
          'Talk about preventing recurrence (monitoring, tests)',
        ],
      },
      {
        id: 'tech-3',
        question: 'Describe your approach to designing a system from scratch.',
        tips: [
          'Start with requirements (functional + non-functional)',
          'Estimate scale: users, requests/sec, data size',
          'High-level design first, then deep-dive into components',
          'Discuss trade-offs: consistency vs availability, latency vs throughput',
        ],
      },
      {
        id: 'tech-4',
        question: 'How do you keep up with new technologies?',
        tips: [
          'Mention specific resources: blogs, podcasts, conferences, side projects',
          'Show depth — don\'t just list technologies, explain what you learned',
          'Balance learning with shipping — knowing when NOT to adopt new tech',
          'Mention communities you contribute to',
        ],
      },
      {
        id: 'tech-5',
        question: 'How would you design [URL shortener / chat system / news feed]?',
        tips: [
          'Clarify requirements and constraints first',
          'Start with API design → Data model → High-level architecture',
          'Address scalability: caching, sharding, load balancing',
          'Discuss trade-offs explicitly — show you think about real-world constraints',
        ],
      },
      {
        id: 'tech-6',
        question: 'What\'s the most challenging bug you\'ve fixed?',
        tips: [
          'Describe the symptoms and why it was hard to diagnose',
          'Walk through your investigation process step by step',
          'Mention any tools or techniques that helped',
          'Share the root cause and how you prevented recurrence',
        ],
      },
    ],
  },
  {
    id: 'situational',
    title: 'Situational & Leadership',
    description: 'Hypothetical scenarios to test your judgment',
    icon: 'Compass',
    color: '#f59e0b',
    questions: [
      {
        id: 'sit-1',
        question: 'If you disagree with your manager\'s technical decision, what do you do?',
        tips: [
          'Approach with data, not emotion — "I noticed X, what if we tried Y?"',
          'Show respect for hierarchy while standing up for good engineering',
          'Disagree and commit if the decision stands after discussion',
          'Pick your battles — not every disagreement is worth escalating',
        ],
      },
      {
        id: 'sit-2',
        question: 'You have two tasks with the same deadline. How do you prioritize?',
        tips: [
          'Assess impact and urgency of each',
          'Communicate early with stakeholders about constraints',
          'See if any can be delegated or deadline extended',
          'Show structured decision-making, not just "work harder"',
        ],
      },
      {
        id: 'sit-3',
        question: 'A teammate is consistently not delivering. How do you handle it?',
        tips: [
          'First, understand their situation — there might be a reason',
          'Offer help before escalating ("Is there anything blocking you?")',
          'If it persists, discuss with your lead privately',
          'Focus on team outcomes, not blame',
        ],
      },
      {
        id: 'sit-4',
        question: 'You discover a security vulnerability in production. What do you do?',
        tips: [
          'Immediately assess severity and potential impact',
          'Report to security team/lead — don\'t try to fix silently',
          'Document everything: when found, potential exposure window',
          'After fix: postmortem, add monitoring, update security practices',
        ],
      },
      {
        id: 'sit-5',
        question: 'Your project scope keeps expanding. How do you manage it?',
        tips: [
          'Identify what\'s MVP vs nice-to-have with stakeholders',
          'Push back with data: "Adding X delays launch by 2 weeks"',
          'Suggest phased delivery — ship core first, iterate',
          'Document scope changes and get sign-off',
        ],
      },
    ],
  },
];

export const companyPatterns: CompanyPattern[] = [
  {
    company: 'Google',
    logo: '🔍',
    difficulty: 'very-hard',
    rounds: [
      'Phone Screen (45 min coding)',
      'Onsite: 2 Coding + 1 System Design + 1 Behavioral (Googleyness)',
      'Team Matching (after committee approval)',
    ],
    tips: [
      'Focus on optimal solutions — brute force won\'t pass',
      'Practice medium-hard graph and DP problems',
      'Googleyness = collaboration, humility, doing the right thing',
      'They value clean code and ability to test your own solution',
    ],
  },
  {
    company: 'Amazon',
    logo: '📦',
    difficulty: 'hard',
    rounds: [
      'Online Assessment (2 coding problems + work simulation)',
      'Phone Screen (1 coding + LP questions)',
      'Onsite: 4-5 rounds (coding + system design + Leadership Principles)',
    ],
    tips: [
      'Know all 16 Leadership Principles by heart — prepare 2 stories for each',
      'They love the STAR format for behavioral answers',
      'Bar raiser round is specifically checking culture fit',
      'System design questions focus on scalability (think AWS-scale)',
    ],
  },
  {
    company: 'Microsoft',
    logo: '🪟',
    difficulty: 'hard',
    rounds: [
      'Online Assessment or Phone Screen',
      'Onsite: 3-4 coding + 1 system design + "As-Appropriate" (final hiring manager)',
    ],
    tips: [
      'Questions are slightly more practical than Google/Meta',
      'They ask about your past projects in depth',
      'Growth mindset is a core value — show you love learning',
      'The "As-Appropriate" round can ask anything — be well-rounded',
    ],
  },
  {
    company: 'Meta',
    logo: '🔵',
    difficulty: 'very-hard',
    rounds: [
      'Phone Screen (coding + behavioral)',
      'Onsite: 2 Coding + 1 System Design + 1 Behavioral',
    ],
    tips: [
      'Speed matters — aim to solve 2 problems in 45 minutes',
      'Focus on medium problems; rarely ask hard-level',
      'System design is very important for senior roles',
      'They value "move fast" — show bias for action in behavioral',
    ],
  },
  {
    company: 'Apple',
    logo: '🍎',
    difficulty: 'hard',
    rounds: [
      'Phone Screen (1-2 technical calls)',
      'Onsite: 5-6 rounds across full day (coding + design + team fit)',
    ],
    tips: [
      'Very team-specific — research the team you\'re applying to',
      'They value domain expertise and craftsmanship',
      'Expect deep dives into your past projects',
      'Questions can be highly specific to the team\'s tech stack',
    ],
  },
  {
    company: 'Netflix',
    logo: '🎬',
    difficulty: 'very-hard',
    rounds: [
      'Recruiter Screen',
      'Hiring Manager Screen',
      'Technical Phone Screen',
      'Onsite: 4-5 rounds (system design heavy)',
    ],
    tips: [
      'Culture memo is critical — read and internalize it',
      'They hire senior-level primarily; very high bar',
      'Focus on system design and distributed systems',
      'Autonomy and judgment are key values — show independent thinking',
    ],
  },
  {
    company: 'Goldman Sachs',
    logo: '🏦',
    difficulty: 'hard',
    rounds: [
      'Online Assessment (aptitude + coding)',
      'Phone Interview (technical + behavioral)',
      'Super Day: 4-5 back-to-back interviews',
    ],
    tips: [
      'Strong focus on DS/Algo fundamentals and OOP concepts',
      'Expect puzzles and probability questions',
      'Know your resume inside out — they grill on projects',
      'Cultural fit: teamwork, integrity, attention to detail',
    ],
  },
  {
    company: 'Uber',
    logo: '🚗',
    difficulty: 'hard',
    rounds: [
      'Phone Screen (coding)',
      'Onsite: 2 Coding + 1 System Design + 1 Behavioral',
    ],
    tips: [
      'Real-world system design: ride matching, surge pricing, ETA',
      'Focus on geospatial problems and real-time systems',
      'Behavioral: collaboration and handling ambiguity',
      'Medium-hard coding problems, focus on efficiency',
    ],
  },
  {
    company: 'Flipkart',
    logo: '🛒',
    difficulty: 'hard',
    rounds: [
      'Online Coding Round (3 problems)',
      'Machine Coding Round (LLD in 90 min)',
      'Problem Solving (DS/Algo)',
      'System Design + Hiring Manager',
    ],
    tips: [
      'Machine coding is unique — practice building clean OOP solutions under time',
      'LLD: Design Parking Lot, BookMyShow, Splitwise-type systems',
      'Focus on code quality, design patterns, SOLID principles',
      'Questions around e-commerce domain (inventory, orders, payments)',
    ],
  },
  {
    company: 'Atlassian',
    logo: '🔷',
    difficulty: 'hard',
    rounds: [
      'Phone Screen (coding)',
      'Values Interview (behavioral)',
      'Technical: 1-2 Coding + System Design',
      'Hiring Manager Round',
    ],
    tips: [
      'Values are paramount — "Don\'t #@!% the customer", "Play as a team"',
      'Prepare stories that demonstrate their specific values',
      'Coding is medium difficulty but clean code is very important',
      'System design around collaboration tools and real-time editing',
    ],
  },
  {
    company: 'Stripe',
    logo: '💳',
    difficulty: 'very-hard',
    rounds: [
      'Phone Screen (practical coding)',
      'Onsite: 2 Coding + 1 System Design + 1 Integration Exercise',
    ],
    tips: [
      'Questions are very practical — build real features, not just algorithms',
      'Expect to work with APIs and handle edge cases',
      'Focus on correctness, testing, and handling failure modes',
      'Financial domain knowledge helps — understand payment flows',
    ],
  },
  {
    company: 'Razorpay',
    logo: '⚡',
    difficulty: 'medium',
    rounds: [
      'Online Coding Round',
      'Technical Interview (DS/Algo)',
      'System Design / Machine Coding',
      'Hiring Manager Round',
    ],
    tips: [
      'Focus on payment systems design — idempotency, eventual consistency',
      'Good understanding of databases and transactions required',
      'Machine coding round tests OOP and clean architecture',
      'Growing startup culture — show ownership and initiative',
    ],
  },
];

export const starMethod: StarStep[] = [
  {
    step: 'S — Situation',
    description: 'Set the scene. Describe the context — where you were, what project, what team, what was happening.',
    example: '"During my summer internship at XYZ, our team was building a real-time notification system for 1M+ users..."',
  },
  {
    step: 'T — Task',
    description: 'Explain YOUR specific responsibility. What were you expected to do? What was the challenge?',
    example: '"I was responsible for designing the message queue architecture that would handle 10K messages/second without dropping any..."',
  },
  {
    step: 'A — Action',
    description: 'Describe what YOU did. Be specific about your actions, decisions, and reasoning. Use "I" not "we".',
    example: '"I researched Kafka vs RabbitMQ, built a prototype with Kafka, implemented dead-letter queues for failed messages, and wrote load tests..."',
  },
  {
    step: 'R — Result',
    description: 'Share the outcome with numbers. What impact did your actions have? What did you learn?',
    example: '"The system handled 15K messages/second in production with 99.99% delivery rate. I learned the importance of designing for failure modes early..."',
  },
];

export const resumeTips: ResumeTipSection[] = [
  {
    category: 'Format & Structure',
    tips: [
      'Keep it to one page for 0-5 years experience',
      'Use reverse chronological order (latest first)',
      'Consistent formatting: same font, spacing, bullet style throughout',
      'Use a clean template — avoid heavy colors, graphics, or photos',
      'File format: PDF only (never .docx) to preserve formatting',
      'Font size: 10-12pt for body, 14-16pt for name',
    ],
  },
  {
    category: 'Content & Writing',
    tips: [
      'Start every bullet with a strong action verb (Built, Designed, Led, Reduced, Improved)',
      'Quantify everything: "Improved API response by 40%" not "Made API faster"',
      'Use XYZ formula: "Accomplished X by doing Y which resulted in Z"',
      'Tailor resume for each company — match keywords from job description',
      'Don\'t list responsibilities — show achievements and impact',
      'Remove filler phrases like "Responsible for" or "Worked on"',
    ],
  },
  {
    category: 'Projects Section',
    tips: [
      'Include 2-3 significant projects with live links or GitHub repos',
      'Mention tech stack used for each project',
      'Highlight the most technically challenging aspect',
      'If no work experience, projects are your main differentiator — invest heavily here',
      'Personal projects > course assignments (shows initiative)',
      'Include scale or users if applicable: "Used by 500+ students"',
    ],
  },
  {
    category: 'Skills Section',
    tips: [
      'Only list technologies you can confidently discuss in an interview',
      'Group by category: Languages, Frameworks, Databases, Tools',
      'Remove outdated/irrelevant skills (no need for MS Office on a dev resume)',
      'Don\'t rate yourself (e.g., "Python: 8/10") — it means nothing',
      'Include relevant coursework only if you\'re a fresher',
    ],
  },
  {
    category: 'Common Mistakes to Avoid',
    tips: [
      'No typos — proofread 3 times and get someone else to check',
      'Don\'t include an objective statement — use a summary only if you have experience',
      'No personal info: DOB, gender, marital status, photo (in most markets)',
      'Don\'t list every technology you\'ve ever touched — curate strategically',
      'Don\'t use tables or multi-column layouts — they break ATS parsing',
      'Never lie or exaggerate — you will get caught in the interview',
    ],
  },
  {
    category: 'ATS (Applicant Tracking System)',
    tips: [
      'Use standard section headings: Experience, Education, Skills, Projects',
      'Include keywords from the job description naturally in your bullets',
      'Avoid headers/footers — ATS often can\'t parse them',
      'Don\'t use abbreviations without spelling them out at least once',
      'Simple, single-column layout parses best',
      'Test your resume with a free ATS checker before submitting',
    ],
  },
];
