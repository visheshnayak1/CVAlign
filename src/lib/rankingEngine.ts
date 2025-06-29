import { supabase } from './supabase';
import { CVProcessor } from './cvProcessor';
import { SemanticSearchEngine } from './semanticSearch';
import { ATSScoringEngine, ATSScore, Feedback } from './atsScoring';

export interface CandidateRanking {
  id: string;
  candidateId: string;
  name: string;
  email: string;
  atsScore: number;
  semanticScore: number;
  overallScore: number;
  matchCategory: 'excellent' | 'good' | 'fair' | 'poor';
  feedback: Feedback;
  rankingPosition: number;
  isRecommended: boolean;
  skills: string[];
  experience: number;
}

export class RankingEngine {
  // Process CVs and generate rankings
  static async processAndRankCandidates(
    jobId: string,
    cvFiles: File[]
  ): Promise<CandidateRanking[]> {
    const rankings: CandidateRanking[] = [];

    // Get job details
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (!job) {
      throw new Error('Job not found');
    }

    // Process each CV
    for (const file of cvFiles) {
      try {
        // Extract CV data
        const cvData = await CVProcessor.extractCVData(file);
        
        // Save candidate
        const candidateId = await CVProcessor.saveCandidate(jobId, cvData);
        
        // Generate and store embeddings
        await SemanticSearchEngine.storeEmbeddings(
          candidateId,
          jobId,
          cvData.text,
          job.description + ' ' + job.requirements
        );

        // Calculate ATS score
        const atsScore = await ATSScoringEngine.calculateATSScore(candidateId, jobId);
        
        // Calculate semantic similarity
        const semanticScore = await SemanticSearchEngine.calculateSimilarity(candidateId, jobId);
        
        // Generate feedback
        const feedback = await ATSScoringEngine.generateFeedback(
          candidateId,
          jobId,
          atsScore,
          semanticScore
        );

        // Calculate overall score (weighted combination)
        const overallScore = Math.round(
          atsScore.totalScore * 0.7 + semanticScore * 100 * 0.3
        );

        // Determine match category
        const matchCategory = this.getMatchCategory(overallScore);

        // Create ranking entry
        const ranking: CandidateRanking = {
          id: '', // Will be set after saving to database
          candidateId,
          name: cvData.name,
          email: cvData.email,
          atsScore: atsScore.totalScore,
          semanticScore: Math.round(semanticScore * 100),
          overallScore,
          matchCategory,
          feedback,
          rankingPosition: 0, // Will be set after sorting
          isRecommended: false, // Will be set based on position and vacancies
          skills: cvData.skills,
          experience: cvData.experienceYears
        };

        rankings.push(ranking);
      } catch (error) {
        console.error(`Failed to process CV ${file.name}:`, error);
        // Continue with other CVs
      }
    }

    // Sort by overall score
    rankings.sort((a, b) => b.overallScore - a.overallScore);

    // Set ranking positions and recommendations
    rankings.forEach((ranking, index) => {
      ranking.rankingPosition = index + 1;
      ranking.isRecommended = index < job.vacancies;
    });

    // Save rankings to database
    await this.saveRankings(jobId, rankings);

    return rankings;
  }

  private static getMatchCategory(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'fair';
    return 'poor';
  }

  private static async saveRankings(jobId: string, rankings: CandidateRanking[]): Promise<void> {
    const rankingData = rankings.map(ranking => ({
      job_id: jobId,
      candidate_id: ranking.candidateId,
      ats_score: ranking.atsScore,
      semantic_score: ranking.semanticScore / 100, // Store as decimal
      overall_score: ranking.overallScore,
      feedback: ranking.feedback,
      match_category: ranking.matchCategory,
      ranking_position: ranking.rankingPosition,
      is_recommended: ranking.isRecommended
    }));

    const { data, error } = await supabase
      .from('rankings')
      .insert(rankingData)
      .select('id');

    if (error) {
      throw new Error(`Failed to save rankings: ${error.message}`);
    }

    // Update ranking IDs
    if (data) {
      rankings.forEach((ranking, index) => {
        ranking.id = data[index].id;
      });
    }
  }

  // Get rankings for a job
  static async getRankings(jobId: string): Promise<CandidateRanking[]> {
    const { data, error } = await supabase
      .from('rankings')
      .select(`
        *,
        candidates (
          name,
          email,
          extracted_skills,
          experience_years
        )
      `)
      .eq('job_id', jobId)
      .order('ranking_position');

    if (error) {
      throw new Error(`Failed to get rankings: ${error.message}`);
    }

    return data.map(item => ({
      id: item.id,
      candidateId: item.candidate_id,
      name: item.candidates.name,
      email: item.candidates.email,
      atsScore: item.ats_score,
      semanticScore: Math.round(item.semantic_score * 100),
      overallScore: item.overall_score,
      matchCategory: item.match_category,
      feedback: item.feedback,
      rankingPosition: item.ranking_position,
      isRecommended: item.is_recommended,
      skills: item.candidates.extracted_skills || [],
      experience: item.candidates.experience_years || 0
    }));
  }

  // Update ranking
  static async updateRanking(
    rankingId: string,
    updates: Partial<Pick<CandidateRanking, 'isRecommended' | 'feedback'>>
  ): Promise<void> {
    const updateData: any = {};
    
    if (updates.isRecommended !== undefined) {
      updateData.is_recommended = updates.isRecommended;
    }
    
    if (updates.feedback !== undefined) {
      updateData.feedback = updates.feedback;
    }

    const { error } = await supabase
      .from('rankings')
      .update(updateData)
      .eq('id', rankingId);

    if (error) {
      throw new Error(`Failed to update ranking: ${error.message}`);
    }
  }
}