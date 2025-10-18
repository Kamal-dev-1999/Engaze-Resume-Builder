/**
 * Predefined skills organized by category
 * Users can select from these or create custom categories and skills
 */

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export const PREDEFINED_SKILLS: SkillCategory[] = [
  {
    id: 'programming',
    name: 'Programming Languages',
    skills: [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'C#',
      'PHP',
      'Ruby',
      'Go',
      'Rust',
      'Kotlin',
      'Swift',
      'Objective-C',
      'Scala',
      'Groovy',
      'Dart',
      'R',
      'MATLAB',
      'SQL',
      'HTML',
      'CSS',
      'XML',
      'JSON',
      'Bash',
      'Shell Scripting',
      'PowerShell',
      'Perl',
      'Lua',
      'VB.NET'
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    skills: [
      'React',
      'Vue.js',
      'Angular',
      'Svelte',
      'Next.js',
      'Nuxt.js',
      'jQuery',
      'Bootstrap',
      'Tailwind CSS',
      'Material UI',
      'CSS Grid',
      'Flexbox',
      'SASS/SCSS',
      'Webpack',
      'Vite',
      'Babel',
      'GraphQL',
      'REST API',
      'Responsive Design',
      'Accessibility (A11y)',
      'Progressive Web Apps (PWA)',
      'Web Components',
      'Redux',
      'Vuex',
      'MobX',
      'Jest',
      'Cypress',
      'Selenium',
      'Storybook'
    ]
  },
  {
    id: 'backend',
    name: 'Backend Development',
    skills: [
      'Node.js',
      'Express.js',
      'Django',
      'Flask',
      'FastAPI',
      'Spring Boot',
      'ASP.NET',
      'Laravel',
      'Ruby on Rails',
      'Gin',
      'Rocket',
      'NestJS',
      'Microservices',
      'RESTful API',
      'GraphQL',
      'Authentication',
      'Authorization',
      'JWT',
      'OAuth',
      'API Gateway',
      'Message Queues',
      'WebSocket',
      'Load Balancing',
      'Caching Strategies',
      'Database Design',
      'Data Migration'
    ]
  },
  {
    id: 'database',
    name: 'Databases',
    skills: [
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Firebase',
      'DynamoDB',
      'Cassandra',
      'Oracle',
      'SQL Server',
      'MariaDB',
      'SQLite',
      'Elasticsearch',
      'Neo4j',
      'CouchDB',
      'RavenDB',
      'InfluxDB',
      'Database Optimization',
      'Query Optimization',
      'Indexing',
      'Replication',
      'Backup & Recovery',
      'ACID Transactions'
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    skills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'Google Cloud',
      'CI/CD',
      'Jenkins',
      'GitLab CI',
      'GitHub Actions',
      'CircleCI',
      'Terraform',
      'Ansible',
      'Puppet',
      'Chef',
      'Infrastructure as Code',
      'Monitoring',
      'Logging',
      'Prometheus',
      'Grafana',
      'ELK Stack',
      'Datadog',
      'New Relic',
      'Linux',
      'Windows Server',
      'Networking',
      'SSL/TLS',
      'VPN',
      'Firewall Configuration'
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    skills: [
      'iOS',
      'Android',
      'React Native',
      'Flutter',
      'Xamarin',
      'Swift',
      'Kotlin',
      'Java',
      'Objective-C',
      'Mobile UI/UX',
      'App Store Deployment',
      'Firebase Mobile',
      'Push Notifications',
      'Offline Sync',
      'Mobile Testing',
      'AppCenter',
      'Fastlane'
    ]
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    skills: [
      'Data Analysis',
      'Data Visualization',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Statistical Analysis',
      'Big Data',
      'Spark',
      'Hadoop',
      'Tableau',
      'Power BI',
      'Jupyter Notebooks',
      'Python Data Science',
      'R Programming',
      'SQL Analytics',
      'ETL',
      'Data Warehousing',
      'Data Pipeline',
      'Apache Airflow'
    ]
  },
  {
    id: 'design',
    name: 'Design & UX',
    skills: [
      'UI Design',
      'UX Design',
      'Figma',
      'Adobe XD',
      'Sketch',
      'Prototyping',
      'Wireframing',
      'User Research',
      'Usability Testing',
      'Accessibility Design',
      'Design Systems',
      'Adobe Creative Suite',
      'Photoshop',
      'Illustrator',
      'InDesign',
      'Graphic Design',
      'Typography',
      'Color Theory',
      'Web Design',
      'Mobile Design',
      'Interaction Design',
      'Design Thinking'
    ]
  },
  {
    id: 'qa',
    name: 'QA & Testing',
    skills: [
      'Manual Testing',
      'Automated Testing',
      'Unit Testing',
      'Integration Testing',
      'End-to-End Testing',
      'Performance Testing',
      'Load Testing',
      'Security Testing',
      'Jest',
      'Mocha',
      'Chai',
      'Cypress',
      'Selenium',
      'TestNG',
      'JUnit',
      'Postman',
      'API Testing',
      'Bug Tracking',
      'Test Planning',
      'Test Case Design',
      'UAT',
      'Regression Testing'
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Soft Skills',
    skills: [
      'Communication',
      'Team Leadership',
      'Project Management',
      'Problem Solving',
      'Critical Thinking',
      'Creativity',
      'Collaboration',
      'Time Management',
      'Adaptability',
      'Agile',
      'Scrum',
      'Kanban',
      'Mentoring',
      'Coaching',
      'Presentation Skills',
      'Public Speaking',
      'Technical Writing',
      'Documentation',
      'Negotiation',
      'Conflict Resolution',
      'Emotional Intelligence',
      'Stakeholder Management'
    ]
  },
  {
    id: 'tools',
    name: 'Tools & Platforms',
    skills: [
      'Git',
      'GitHub',
      'GitLab',
      'Bitbucket',
      'JIRA',
      'Confluence',
      'Slack',
      'Notion',
      'Monday.com',
      'Asana',
      'Trello',
      'VS Code',
      'IntelliJ IDEA',
      'Visual Studio',
      'Sublime Text',
      'Terminal/Command Line',
      'Vim',
      'Linux',
      'macOS',
      'Windows',
      'Docker Desktop',
      'Postman',
      'Insomnia',
      'npm',
      'yarn',
      'pip',
      'Maven',
      'Gradle'
    ]
  },
  {
    id: 'security',
    name: 'Security',
    skills: [
      'Cybersecurity',
      'Network Security',
      'Application Security',
      'Authentication',
      'Authorization',
      'Encryption',
      'SSL/TLS',
      'JWT',
      'OAuth',
      'OWASP',
      'Penetration Testing',
      'Vulnerability Assessment',
      'Secure Coding',
      'Security Auditing',
      'Compliance',
      'GDPR',
      'CCPA',
      'Data Protection',
      'Identity Management',
      'Access Control'
    ]
  },
  {
    id: 'other',
    name: 'Other',
    skills: [
      'Blockchain',
      'Smart Contracts',
      'Ethereum',
      'Web3',
      'IoT',
      'Embedded Systems',
      'AR/VR',
      'Game Development',
      'Unity',
      'Unreal Engine',
      'Artificial Intelligence',
      'Robotics',
      'Microcontrollers',
      'Arduino',
      'Raspberry Pi'
    ]
  }
];

export const getAllSkills = (): string[] => {
  return PREDEFINED_SKILLS.flatMap(cat => cat.skills);
};

export const getSkillCategory = (skill: string): string | undefined => {
  for (const category of PREDEFINED_SKILLS) {
    if (category.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      return category.id;
    }
  }
  return undefined;
};

export const getCategoryName = (categoryId: string): string => {
  const category = PREDEFINED_SKILLS.find(c => c.id === categoryId);
  return category?.name || categoryId;
};
