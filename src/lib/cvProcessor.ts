import { supabase } from './supabase';

export interface CVData {
  name: string;
  email: string;
  phone?: string;
  text: string;
  filename: string;
  skills: string[];
  experienceYears: number;
  education?: string;
}

export interface JobData {
  title: string;
  description: string;
  requirements: string;
  vacancies: number;
}

export class CVProcessor {
  // Extract text and metadata from CV file
  static async extractCVData(file: File): Promise<CVData> {
    // In a real implementation, this would use PDF parsing libraries
    // For demo purposes, we'll simulate CV extraction
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
      'sarah_johnson': `
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
      'michael_chen': `
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
      'emily_davis': `
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
      `
    };

    // Return mock CV based on filename or generate generic one
    const fileName = file.name.toLowerCase().replace(/[^a-z]/g, '_');
    for (const [key, cv] of Object.entries(mockCVs)) {
      if (fileName.includes(key.split('_')[0])) {
        return cv;
      }
    }

    // Generic CV for unknown files
    return `
      John Doe
      Software Developer
      john.doe@email.com | +1-555-0000
      
      EXPERIENCE
      Software Developer at TechCompany (2022-2024) - 2 years
      - Web application development
      - Frontend and backend programming
      
      SKILLS
      HTML, CSS, JavaScript, React, Node.js
      
      EDUCATION
      Bachelor of Computer Science, State University (2018-2022)
    `;
  }

  private static extractName(text: string): string {
    const lines = text.trim().split('\n');
    const firstLine = lines[0]?.trim();
    
    // Simple name extraction - first non-empty line
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
      'AWS', 'Docker', 'Git', 'MongoDB', 'Express', 'Spring', 'Django'
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

  // Save candidate to database
  static async saveCandidate(jobId: string, cvData: CVData): Promise<string> {
    const { data, error } = await supabase
      .from('candidates')
      .insert({
        job_id: jobId,
        name: cvData.name,
        email: cvData.email,
        phone: cvData.phone,
        cv_text: cvData.text,
        cv_filename: cvData.filename,
        extracted_skills: cvData.skills,
        experience_years: cvData.experienceYears,
        education: cvData.education
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to save candidate: ${error.message}`);
    }

    return data.id;
  }

  // Create job posting
  static async createJob(jobData: JobData): Promise<string> {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        vacancies: jobData.vacancies
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }

    return data.id;
  }
}