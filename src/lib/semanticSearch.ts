import { supabase } from './supabase';

export interface EmbeddingResponse {
  embedding: number[];
}

export class SemanticSearchEngine {
  private static readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Generate embeddings using OpenAI (or mock for demo)
  static async generateEmbedding(text: string): Promise<number[]> {
    // For demo purposes, we'll generate mock embeddings
    // In production, this would call OpenAI's embedding API
    return this.generateMockEmbedding(text);
  }

  private static generateMockEmbedding(text: string): number[] {
    // Generate a consistent mock embedding based on text content
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(1536).fill(0);
    
    // Create pseudo-embeddings based on word content
    words.forEach((word, index) => {
      const hash = this.simpleHash(word);
      const position = hash % 1536;
      embedding[position] += 0.1;
    });

    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
  }

  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Store embeddings in database
  static async storeEmbeddings(
    candidateId: string,
    jobId: string,
    cvText: string,
    jobDescription: string
  ): Promise<void> {
    const cvEmbedding = await this.generateEmbedding(cvText);
    const jobEmbedding = await this.generateEmbedding(jobDescription);

    const { error } = await supabase
      .from('cv_embeddings')
      .insert({
        candidate_id: candidateId,
        job_id: jobId,
        cv_embedding: cvEmbedding,
        job_embedding: jobEmbedding
      });

    if (error) {
      throw new Error(`Failed to store embeddings: ${error.message}`);
    }
  }

  // Calculate semantic similarity
  static async calculateSimilarity(candidateId: string, jobId: string): Promise<number> {
    const { data, error } = await supabase
      .from('cv_embeddings')
      .select('cv_embedding, job_embedding')
      .eq('candidate_id', candidateId)
      .eq('job_id', jobId)
      .single();

    if (error || !data) {
      throw new Error('Failed to retrieve embeddings for similarity calculation');
    }

    return this.cosineSimilarity(data.cv_embedding, data.job_embedding);
  }

  private static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  // Search similar candidates
  static async searchSimilarCandidates(
    jobId: string,
    limit: number = 10
  ): Promise<Array<{ candidateId: string; similarity: number }>> {
    // In a real implementation, this would use pgvector's similarity search
    // For demo, we'll get all candidates and calculate similarities
    const { data, error } = await supabase
      .from('cv_embeddings')
      .select('candidate_id, cv_embedding, job_embedding')
      .eq('job_id', jobId);

    if (error) {
      throw new Error(`Failed to search candidates: ${error.message}`);
    }

    const similarities = data.map(item => ({
      candidateId: item.candidate_id,
      similarity: this.cosineSimilarity(item.cv_embedding, item.job_embedding)
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
}