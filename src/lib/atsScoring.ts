import { supabase } from './supabase';

export interface ATSCriteria {
  skillsWeight: number;
  experienceWeight: number;
  educationWeight: number;
  keywordsWeight: number;
}

export interface ATSScore {
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  keywordsScore: number;
  totalScore: number;
}

export interface Feedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skillGaps: string[];
  overallAssessment: string;
}

export class ATSScoringEngine {
  private static readonly DEFAULT_CRITERIA: ATSCriteria = {
    skillsWeight: 0.4,
    experienceWeight: 0.3,
    educationWeight: 0.15,
    keywordsWeight: 0.15
  };

  // Calculate ATS score for a candidate
  static async calculateATSScore(
    candidateId: string,
    jobId: string,
    criteria: ATSCriteria = this.DEFAULT_CRITERIA
  ): Promise<ATSScore> {
    // Get candidate and job data
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (candidateError || jobError || !candidate || !job) {
      throw new Error('Failed to retrieve candidate or job data');
    }

    // Calculate individual scores
    const skillsScore = this.calculateSkillsScore(candidate.extracted_skills, job.requirements);
    const experienceScore = this.calculateExperienceScore(candidate.experience_years, job.requirements);
    const educationScore = this.calculateEducationScore(candidate.education, job.requirements);
    const keywordsScore = this.calculateKeywordsScore(candidate.cv_text, job.requirements);

    // Calculate weighted total score
    const totalScore = Math.round(
      skillsScore * criteria.skillsWeight +
      experienceScore * criteria.experienceWeight +
      educationScore * criteria.educationWeight +
      keywordsScore * criteria.keywordsWeight
    );

    return {
      skillsScore,
      experienceScore,
      educationScore,
      keywordsScore,
      totalScore: Math.min(100, Math.max(0, totalScore))
    };
  }

  private static calculateSkillsScore(candidateSkills: string[], jobRequirements: string): number {
    const requiredSkills = this.extractRequiredSkills(jobRequirements);
    if (requiredSkills.length === 0) return 70; // Default score if no skills found

    const matchedSkills = candidateSkills.filter(skill =>
      requiredSkills.some(required =>
        required.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(required.toLowerCase())
      )
    );

    const matchPercentage = matchedSkills.length / requiredSkills.length;
    return Math.min(100, Math.round(matchPercentage * 100 + 20)); // Bonus for having skills
  }

  private static calculateExperienceScore(candidateYears: number, jobRequirements: string): number {
    const requiredYears = this.extractRequiredExperience(jobRequirements);
    
    if (candidateYears >= requiredYears) {
      return Math.min(100, 80 + (candidateYears - requiredYears) * 5);
    } else {
      const ratio = candidateYears / requiredYears;
      return Math.round(ratio * 80);
    }
  }

  private static calculateEducationScore(candidateEducation: string | null, jobRequirements: string): number {
    if (!candidateEducation) return 50; // Default score for missing education

    const educationLevel = this.getEducationLevel(candidateEducation);
    const requiredLevel = this.getRequiredEducationLevel(jobRequirements);

    if (educationLevel >= requiredLevel) {
      return 90 + (educationLevel - requiredLevel) * 5;
    } else {
      return Math.round((educationLevel / requiredLevel) * 70);
    }
  }

  private static calculateKeywordsScore(cvText: string, jobRequirements: string): number {
    const jobKeywords = this.extractKeywords(jobRequirements);
    const cvKeywords = this.extractKeywords(cvText);

    const matchedKeywords = jobKeywords.filter(keyword =>
      cvKeywords.some(cvKeyword =>
        cvKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (jobKeywords.length === 0) return 70;
    return Math.round((matchedKeywords.length / jobKeywords.length) * 100);
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
    return match ? parseInt(match[1]) : 2; // Default 2 years if not specified
  }

  private static getEducationLevel(education: string): number {
    const educationLower = education.toLowerCase();
    if (educationLower.includes('phd') || educationLower.includes('doctorate')) return 4;
    if (educationLower.includes('master') || educationLower.includes('mba')) return 3;
    if (educationLower.includes('bachelor') || educationLower.includes('degree')) return 2;
    if (educationLower.includes('associate') || educationLower.includes('diploma')) return 1;
    return 0;
  }

  private static getRequiredEducationLevel(jobRequirements: string): number {
    const requirementsLower = jobRequirements.toLowerCase();
    if (requirementsLower.includes('phd') || requirementsLower.includes('doctorate')) return 4;
    if (requirementsLower.includes('master') || requirementsLower.includes('mba')) return 3;
    if (requirementsLower.includes('bachelor') || requirementsLower.includes('degree')) return 2;
    if (requirementsLower.includes('associate') || requirementsLower.includes('diploma')) return 1;
    return 2; // Default bachelor's degree requirement
  }

  private static extractKeywords(text: string): string[] {
    const keywords = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['with', 'have', 'been', 'will', 'this', 'that', 'they', 'them', 'their'].includes(word));

    return [...new Set(keywords)]; // Remove duplicates
  }

  // Generate AI-powered feedback
  static async generateFeedback(
    candidateId: string,
    jobId: string,
    atsScore: ATSScore,
    semanticScore: number
  ): Promise<Feedback> {
    // Get candidate and job data
    const { data: candidate } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (!candidate || !job) {
      throw new Error('Failed to retrieve data for feedback generation');
    }

    const requiredSkills = this.extractRequiredSkills(job.requirements);
    const candidateSkills = candidate.extracted_skills || [];
    const missingSkills = requiredSkills.filter(skill =>
      !candidateSkills.some(cSkill =>
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
    if (semanticScore >= 0.8) {
      strengths.push('CV content highly relevant to job description');
    }
    if (candidateSkills.length >= 5) {
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
    let overallAssessment = '';
    const overallScore = (atsScore.totalScore + semanticScore * 100) / 2;
    
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
}