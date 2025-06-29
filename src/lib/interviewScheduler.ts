import { supabase } from './supabase';

export interface InterviewScheduleRequest {
  jobId: string;
  candidateIds: string[];
  interviewType: 'standard' | 'tavus_ai';
  scheduledAt?: Date;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export class InterviewScheduler {
  // Schedule interviews for top candidates
  static async scheduleInterviews(request: InterviewScheduleRequest): Promise<string[]> {
    const interviewIds: string[] = [];

    for (const candidateId of request.candidateIds) {
      // Get ranking for the candidate
      const { data: ranking } = await supabase
        .from('rankings')
        .select('id')
        .eq('job_id', request.jobId)
        .eq('candidate_id', candidateId)
        .single();

      if (!ranking) continue;

      // Create interview record
      const { data: interview, error } = await supabase
        .from('interviews')
        .insert({
          job_id: request.jobId,
          candidate_id: candidateId,
          ranking_id: ranking.id,
          interview_type: request.interviewType,
          scheduled_at: request.scheduledAt?.toISOString(),
          status: 'scheduled'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create interview:', error);
        continue;
      }

      interviewIds.push(interview.id);

      // Send interview invitation email
      await this.sendInterviewInvitation(candidateId, request.jobId, interview.id);
    }

    return interviewIds;
  }

  // Send interview invitation email
  private static async sendInterviewInvitation(
    candidateId: string,
    jobId: string,
    interviewId: string
  ): Promise<void> {
    // Get candidate and job details
    const { data: candidate } = await supabase
      .from('candidates')
      .select('name, email')
      .eq('id', candidateId)
      .single();

    const { data: job } = await supabase
      .from('jobs')
      .select('title')
      .eq('id', jobId)
      .single();

    if (!candidate || !job) return;

    const emailTemplate = this.generateEmailTemplate(candidate.name, job.title);
    
    // In a real implementation, this would integrate with an email service
    console.log('Sending interview invitation:', {
      to: candidate.email,
      subject: emailTemplate.subject,
      body: emailTemplate.body,
      interviewId
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private static generateEmailTemplate(candidateName: string, jobTitle: string): EmailTemplate {
    return {
      subject: `Interview Invitation - ${jobTitle} Position`,
      body: `
Dear ${candidateName},

We are pleased to invite you for an interview for the ${jobTitle} position at our company.

Based on our initial review of your application, we believe you could be a great fit for our team. We would like to schedule an interview to discuss your qualifications and learn more about your experience.

Interview Details:
- Position: ${jobTitle}
- Format: Video Interview
- Duration: Approximately 45 minutes

Please reply to this email with your availability for the next week, and we will send you the interview link and additional details.

We look forward to speaking with you soon!

Best regards,
The Hiring Team

---
This email was sent through CVAlign's automated interview scheduling system.
      `.trim()
    };
  }

  // Get interview statistics
  static async getInterviewStats(jobId: string): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  }> {
    const { data: interviews } = await supabase
      .from('interviews')
      .select('status')
      .eq('job_id', jobId);

    if (!interviews) {
      return { total: 0, scheduled: 0, completed: 0, cancelled: 0 };
    }

    const stats = interviews.reduce((acc, interview) => {
      acc.total++;
      acc[interview.status as keyof typeof acc]++;
      return acc;
    }, { total: 0, scheduled: 0, completed: 0, cancelled: 0 });

    return stats;
  }

  // Update interview status
  static async updateInterviewStatus(
    interviewId: string,
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled',
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('interviews')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', interviewId);

    if (error) {
      throw new Error(`Failed to update interview status: ${error.message}`);
    }
  }
}