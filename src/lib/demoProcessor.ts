// Demo-specific processor that doesn't require database operations
export interface DemoCVData {
  name: string;
  email: string;
  phone?: string;
  text: string;
  filename: string;
  skills: string[];
  experienceYears: number;
  education?: string;
}

export interface DemoJobData {
  title: string;
  description: string;
  requirements: string;
  vacancies: number;
}

export interface DemoFeedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skillGaps: string[];
  overallAssessment: string;
}

export interface DemoCandidateRanking {
  id: string;
  candidateId: string;
  name: string;
  email: string;
  atsScore: number;
  semanticScore: number;
  overallScore: number;
  matchCategory: 'excellent' | 'good' | 'fair' | 'poor';
  feedback: DemoFeedback;
  rankingPosition: number;
  isRecommended: boolean;
  skills: string[];
  experience: number;
}

export class DemoProcessor {
  // Extract text and metadata from CV file (demo version)
  static async extractCVData(file: File): Promise<DemoCVData> {
    const text = await this.simulateTextExtraction(file);
    
    return {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      text: text,
      filename: file.name,
      skills: this.extractSkills(text),
      experienceYears: this.extractExperience(text),
      education: this.extractEducation(text)
    };
  }

  private static async simulateTextExtraction(file: File): Promise<string> {
    // Simulate CV text extraction based on filename
    const mockCVs = {
      'sarah': `
        Sarah Johnson
        Senior Frontend Developer
        sarah.johnson@email.com | +1-555-0123
        
        EXPERIENCE
        Senior Frontend Developer at TechCorp (2019-2024) - 5 years
        - Developed React applications with TypeScript
        - Led team of 4 developers
        - Implemented CI/CD pipelines
        
        SKILLS
        React, TypeScript, Node.js, JavaScript, HTML, CSS, Git, AWS
        
        EDUCATION
        Bachelor of Computer Science, MIT (2015-2019)
      `,
      'michael': `
        Michael Chen
        Full Stack Developer
        michael.chen@email.com | +1-555-0124
        
        EXPERIENCE
        Full Stack Developer at StartupXYZ (2020-2024) - 4 years
        - Built scalable web applications
        - Python backend development
        - AWS cloud infrastructure
        
        SKILLS
        JavaScript, Python, AWS, Docker, PostgreSQL, React
        
        EDUCATION
        Master of Software Engineering, Stanford (2018-2020)
      `,
      'emily': `
        Emily Davis
        Web Developer
        emily.davis@email.com | +1-555-0125
        
        EXPERIENCE
        Web Developer at WebAgency (2021-2024) - 3 years
        - Vue.js frontend development
        - PHP backend systems
        - MySQL database design
        
        SKILLS
        Vue.js, PHP, MySQL, HTML, CSS, JavaScript
        
        EDUCATION
        Bachelor of Information Technology, UC Berkeley (2017-2021)
      `,
      'david': `
        David Wilson
        Junior Developer
        david.wilson@email.com | +1-555-0126
        
        EXPERIENCE
        Junior Developer at CodeCorp (2022-2024) - 2 years
        - Frontend development with HTML/CSS
        - Basic JavaScript programming
        - jQuery implementations
        
        SKILLS
        HTML, CSS, JavaScript, jQuery, Bootstrap
        
        EDUCATION
        Associate Degree in Web Development, Community College (2020-2022)
      `,
      'lisa': `
        Lisa Anderson
        Software Engineer
        lisa.anderson@email.com | +1-555-0127
        
        EXPERIENCE
        Software Engineer at TechStart (2021-2024) - 3 years
        - Angular frontend development
        - Java Spring backend
        - Database optimization
        
        SKILLS
        Angular, Java, Spring, MySQL, Git, Jenkins
        
        EDUCATION
        Bachelor of Computer Engineering, State University (2017-2021)
      `
    };

    // Return mock CV based on filename or generate generic one
    const fileName = file.name.toLowerCase().replace(/[^a-z]/g, '');
    for (const [key, cv] of Object.entries(mockCVs)) {
      if (fileName.includes(key)) {
        return cv;
      }
    }

    // Generate a unique CV for unknown files
    const names = ['Alex Smith', 'Jordan Brown', 'Taylor Davis', 'Casey Wilson', 'Morgan Lee'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomEmail = randomName.toLowerCase().replace(' ', '.') + '@email.com';
    const randomYears = Math.floor(Math.random() * 5) + 1;
    
    return `
      ${randomName}
      Software Developer
      ${randomEmail} | +1-555-${Math.floor(Math.random() * 9000) + 1000}
      
      EXPERIENCE
      Software Developer at TechCompany (${2024 - randomYears}-2024) - ${randomYears} years
      - Web application development
      - Frontend and backend programming
      
      SKILLS
      HTML, CSS, JavaScript, React, Node.js
      
      EDUCATION
      Bachelor of Computer Science, University (${2024 - randomYears - 4}-${2024 - randomYears})
    `;
  }

  private static extractName(text: string): string {
    const lines = text.trim().split('\n');
    const firstLine = lines[0]?.trim();
    
    if (firstLine && !firstLine.includes('@') && !firstLine.includes('EXPERIENCE')) {
      return firstLine;
    }
    
    return 'Unknown Candidate';
  }

  private static extractEmail(text: string): string {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : 'no-email@example.com';
  }

  private static extractPhone(text: string): string | undefined {
    const phoneRegex = /[\+]?[1-9]?[\-\s]?\(?[0-9]{3}\)?[\-\s]?[0-9]{3}[\-\s]?[0-9]{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : undefined;
  }

  private static extractSkills(text: string): string[] {
    const skillsSection = text.match(/SKILLS[\s\S]*?(?=\n\n|\nEDUCATION|\nEXPERIENCE|$)/i);
    if (!skillsSection) return [];

    const skillsText = skillsSection[0];
    const commonSkills = [
      'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'Node.js',
      'Python', 'Java', 'PHP', 'HTML', 'CSS', 'SQL', 'MySQL', 'PostgreSQL',
      'AWS', 'Docker', 'Git', 'MongoDB', 'Express', 'Spring', 'Django',
      'jQuery', 'Bootstrap', 'Jenkins'
    ];

    return commonSkills.filter(skill => 
      skillsText.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private static extractExperience(text: string): number {
    const experienceRegex = /(\d+)\s*years?/i;
    const match = text.match(experienceRegex);
    return match ? parseInt(match[1]) : 0;
  }

  private static extractEducation(text: string): string | undefined {
    const educationSection = text.match(/EDUCATION[\s\S]*?(?=\n\n|$)/i);
    if (!educationSection) return undefined;

    const lines = educationSection[0].split('\n').filter(line => line.trim());
    return lines.length > 1 ? lines[1].trim() : undefined;
  }

  // Calculate ATS score (demo version)
  static calculateATSScore(candidate: DemoCVData, jobRequirements: string): {
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    keywordsScore: number;
    totalScore: number;
  } {
    const requiredSkills = this.extractRequiredSkills(jobRequirements);
    const requiredYears = this.extractRequiredExperience(jobRequirements);

    // Skills score
    const matchedSkills = candidate.skills.filter(skill =>
      requiredSkills.some(required =>
        required.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(required.toLowerCase())
      )
    );
    const skillsScore = requiredSkills.length > 0 
      ? Math.min(100, Math.round((matchedSkills.length / requiredSkills.length) * 100 + 20))
      : 70;

    // Experience score
    const experienceScore = candidate.experienceYears >= requiredYears
      ? Math.min(100, 80 + (candidate.experienceYears - requiredYears) * 5)
      : Math.round((candidate.experienceYears / requiredYears) * 80);

    // Education score
    const educationScore = candidate.education ? 85 : 50;

    // Keywords score
    const jobKeywords = this.extractKeywords(jobRequirements);
    const cvKeywords = this.extractKeywords(candidate.text);
    const matchedKeywords = jobKeywords.filter(keyword =>
      cvKeywords.some(cvKeyword =>
        cvKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    const keywordsScore = jobKeywords.length > 0 
      ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
      : 70;

    // Calculate weighted total
    const totalScore = Math.round(
      skillsScore * 0.4 +
      experienceScore * 0.3 +
      educationScore * 0.15 +
      keywordsScore * 0.15
    );

    return {
      skillsScore,
      experienceScore,
      educationScore,
      keywordsScore,
      totalScore: Math.min(100, Math.max(0, totalScore))
    };
  }

  // Calculate semantic similarity (demo version)
  static calculateSemanticScore(candidate: DemoCVData, jobDescription: string): number {
    const candidateWords = this.extractKeywords(candidate.text);
    const jobWords = this.extractKeywords(jobDescription);
    
    const commonWords = candidateWords.filter(word => 
      jobWords.some(jobWord => jobWord.toLowerCase() === word.toLowerCase())
    );
    
    const similarity = jobWords.length > 0 
      ? commonWords.length / jobWords.length
      : 0.5;
    
    return Math.min(100, Math.round(similarity * 100 + Math.random() * 20));
  }

  // Generate feedback (demo version)
  static generateFeedback(
    candidate: DemoCVData,
    atsScore: any,
    semanticScore: number,
    jobRequirements: string
  ): DemoFeedback {
    const requiredSkills = this.extractRequiredSkills(jobRequirements);
    const missingSkills = requiredSkills.filter(skill =>
      !candidate.skills.some(cSkill =>
        cSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths
    if (atsScore.skillsScore >= 80) {
      strengths.push('Strong technical skill set matching job requirements');
    }
    if (atsScore.experienceScore >= 80) {
      strengths.push('Excellent relevant work experience');
    }
    if (semanticScore >= 80) {
      strengths.push('CV content highly relevant to job description');
    }
    if (candidate.skills.length >= 5) {
      strengths.push('Diverse technical skill portfolio');
    }

    // Analyze weaknesses
    if (atsScore.skillsScore < 60) {
      weaknesses.push('Limited technical skills matching job requirements');
    }
    if (atsScore.experienceScore < 60) {
      weaknesses.push('Insufficient relevant work experience');
    }
    if (missingSkills.length > 3) {
      weaknesses.push('Missing several key technical skills');
    }

    // Generate recommendations
    if (missingSkills.length > 0) {
      recommendations.push(`Consider gaining experience in: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    if (atsScore.experienceScore < 70) {
      recommendations.push('Highlight more relevant project experience and achievements');
    }
    if (atsScore.keywordsScore < 70) {
      recommendations.push('Include more industry-specific keywords and terminology');
    }

    // Overall assessment
    const overallScore = (atsScore.totalScore + semanticScore) / 2;
    let overallAssessment = '';
    
    if (overallScore >= 85) {
      overallAssessment = 'Excellent candidate with strong alignment to job requirements';
    } else if (overallScore >= 70) {
      overallAssessment = 'Good candidate with solid qualifications and potential';
    } else if (overallScore >= 55) {
      overallAssessment = 'Fair candidate with some relevant skills but gaps in key areas';
    } else {
      overallAssessment = 'Limited alignment with job requirements, significant skill gaps';
    }

    return {
      strengths: strengths.length > 0 ? strengths : ['Basic qualifications present'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['No major weaknesses identified'],
      recommendations: recommendations.length > 0 ? recommendations : ['Continue developing technical skills'],
      skillGaps: missingSkills,
      overallAssessment
    };
  }

  // Process and rank candidates (demo version)
  static async processAndRankCandidates(
    jobData: DemoJobData,
    cvFiles: File[]
  ): Promise<DemoCandidateRanking[]> {
    const rankings: DemoCandidateRanking[] = [];

    // Process each CV
    for (let i = 0; i < cvFiles.length; i++) {
      const file = cvFiles[i];
      
      try {
        // Extract CV data
        const cvData = await this.extractCVData(file);
        
        // Calculate scores
        const atsScore = this.calculateATSScore(cvData, jobData.requirements);
        const semanticScore = this.calculateSemanticScore(cvData, jobData.description);
        
        // Generate feedback
        const feedback = this.generateFeedback(cvData, atsScore, semanticScore, jobData.requirements);
        
        // Calculate overall score
        const overallScore = Math.round(atsScore.totalScore * 0.7 + semanticScore * 0.3);
        
        // Determine match category
        const matchCategory = this.getMatchCategory(overallScore);
        
        const ranking: DemoCandidateRanking = {
          id: `demo-${i}`,
          candidateId: `candidate-${i}`,
          name: cvData.name,
          email: cvData.email,
          atsScore: atsScore.totalScore,
          semanticScore,
          overallScore,
          matchCategory,
          feedback,
          rankingPosition: 0, // Will be set after sorting
          isRecommended: false, // Will be set based on position
          skills: cvData.skills,
          experience: cvData.experienceYears
        };

        rankings.push(ranking);
      } catch (error) {
        console.error(`Failed to process CV ${file.name}:`, error);
      }
    }

    // Sort by overall score
    rankings.sort((a, b) => b.overallScore - a.overallScore);

    // Set ranking positions and recommendations
    rankings.forEach((ranking, index) => {
      ranking.rankingPosition = index + 1;
      ranking.isRecommended = index < jobData.vacancies;
    });

    return rankings;
  }

  private static getMatchCategory(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'fair';
    return 'poor';
  }

  private static extractRequiredSkills(jobRequirements: string): string[] {
    const commonSkills = [
      'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'Node.js',
      'Python', 'Java', 'PHP', 'HTML', 'CSS', 'SQL', 'MySQL', 'PostgreSQL',
      'AWS', 'Docker', 'Git', 'MongoDB', 'Express', 'Spring', 'Django',
      'Kubernetes', 'Redis', 'GraphQL', 'REST API', 'Microservices'
    ];

    return commonSkills.filter(skill =>
      jobRequirements.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private static extractRequiredExperience(jobRequirements: string): number {
    const experienceRegex = /(\d+)[\+\s]*years?\s*(?:of\s*)?experience/i;
    const match = jobRequirements.match(experienceRegex);
    return match ? parseInt(match[1]) : 2;
  }

  private static extractKeywords(text: string): string[] {
    const keywords = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['with', 'have', 'been', 'will', 'this', 'that', 'they', 'them', 'their'].includes(word));

    return [...new Set(keywords)];
  }
}