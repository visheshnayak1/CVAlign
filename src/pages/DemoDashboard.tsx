import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Upload, FileText, Users, Zap, Download, Mail, BarChart3, 
  Clock, Target, Star, TrendingUp, Award, MessageSquare, Calendar,
  CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import { DemoProcessor, DemoCandidateRanking } from '../lib/demoProcessor';

export default function DemoDashboard() {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [vacancies, setVacancies] = useState(1);
  const [uploadedCVs, setUploadedCVs] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DemoCandidateRanking[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<DemoCandidateRanking | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rankings' | 'feedback' | 'interviews'>('overview');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedCVs(prev => [...prev, ...files]);
  };

  const removeCV = (index: number) => {
    setUploadedCVs(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !jobTitle.trim() || uploadedCVs.length === 0) {
      alert('Please provide job title, description and upload at least one CV');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process CVs using demo processor
      const rankings = await DemoProcessor.processAndRankCandidates(
        {
          title: jobTitle,
          description: jobDescription,
          requirements: jobDescription,
          vacancies
        },
        uploadedCVs
      );
      
      setResults(rankings);
      setActiveTab('rankings');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScheduleInterviews = async () => {
    if (results.length === 0) return;

    const topCandidates = results.filter(r => r.isRecommended);
    
    // Simulate scheduling
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`Interview invitations sent to ${topCandidates.length} top candidates!`);
  };

  const handleDownloadReport = () => {
    const report = {
      jobTitle,
      totalCandidates: results.length,
      recommendedCandidates: results.filter(r => r.isRecommended).length,
      averageScore: Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length),
      rankings: results.map(r => ({
        name: r.name,
        email: r.email,
        atsScore: r.atsScore,
        semanticScore: r.semanticScore,
        overallScore: r.overallScore,
        matchCategory: r.matchCategory,
        isRecommended: r.isRecommended
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cvAlign-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 55) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchIcon = (category: string) => {
    switch (category) {
      case 'excellent': return <Award className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'fair': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-blue-200"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">CVAlign Analytics Dashboard</h1>
                  <p className="text-blue-600">AI-powered CV analysis and candidate ranking system</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-700 font-medium">Demo Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Job Setup
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Job Description & Requirements
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste your job description and requirements here..."
                    className="w-full h-32 p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Number of Positions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={vacancies}
                    onChange={(e) => setVacancies(parseInt(e.target.value))}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload CVs
              </h2>
              
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-600 mb-2">Drop CV files here or click to browse</p>
                <p className="text-sm text-blue-500 mb-4">Supports PDF, DOC, DOCX files</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                >
                  Choose Files
                </label>
              </div>

              {uploadedCVs.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-blue-900">Uploaded CVs ({uploadedCVs.length})</p>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {uploadedCVs.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-900 text-sm truncate">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeCV(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim() || !jobTitle.trim() || uploadedCVs.length === 0}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Analyzing CVs...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Analyze CVs
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total CVs</p>
                      <p className="text-2xl font-bold text-blue-900">{results.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Recommended</p>
                      <p className="text-2xl font-bold text-green-600">{results.filter(r => r.isRecommended).length}</p>
                    </div>
                    <Star className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Top Score</p>
                      <p className="text-2xl font-bold text-blue-900">{Math.max(...results.map(r => r.overallScore))}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Avg Score</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-xl shadow-lg">
              {results.length > 0 && (
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'rankings', label: 'Rankings', icon: Users },
                      { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                      { id: 'interviews', label: 'Interviews', icon: Calendar }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              <div className="p-6">
                {results.length === 0 ? (
                  <div className="bg-blue-50 rounded-lg p-12 text-center">
                    <Users className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-blue-900 mb-2">Ready to Analyze</h3>
                    <p className="text-blue-600">Upload CVs and add job details to see AI-powered candidate analysis</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-blue-900">Analysis Overview</h3>
                          <div className="flex space-x-2">
                            <button 
                              onClick={handleDownloadReport}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleScheduleInterviews}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Schedule Interviews
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-900 mb-4">Score Distribution</h4>
                            <div className="space-y-3">
                              {['excellent', 'good', 'fair', 'poor'].map(category => {
                                const count = results.filter(r => r.matchCategory === category).length;
                                const percentage = (count / results.length) * 100;
                                return (
                                  <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {getMatchIcon(category)}
                                      <span className="capitalize text-sm font-medium">{category}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                                        <div 
                                          className="h-2 bg-blue-600 rounded-full" 
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm text-gray-600">{count}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="bg-green-50 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-900 mb-4">Top Skills Found</h4>
                            <div className="flex flex-wrap gap-2">
                              {Array.from(new Set(results.flatMap(r => r.skills)))
                                .slice(0, 12)
                                .map(skill => (
                                  <span key={skill} className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {skill}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'rankings' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-blue-900">Candidate Rankings</h3>
                          <div className="text-sm text-blue-600">
                            Showing {results.length} candidates • {results.filter(r => r.isRecommended).length} recommended
                          </div>
                        </div>

                        <div className="space-y-4">
                          {results.map((candidate, index) => (
                            <div 
                              key={candidate.id} 
                              className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                                selectedCandidate?.id === candidate.id ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                              }`}
                              onClick={() => setSelectedCandidate(candidate)}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                    candidate.isRecommended ? 'bg-blue-600' : 'bg-blue-400'
                                  }`}>
                                    {candidate.rankingPosition}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-blue-900 text-lg flex items-center space-x-2">
                                      <span>{candidate.name}</span>
                                      {candidate.isRecommended && (
                                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                          Recommended
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-sm text-blue-600">{candidate.email}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`font-bold text-2xl px-3 py-1 rounded-lg ${getScoreColor(candidate.overallScore)}`}>
                                    {candidate.overallScore}%
                                  </div>
                                  <div className="text-sm text-blue-600 capitalize">{candidate.matchCategory} Match</div>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <div className="w-full h-3 bg-blue-200 rounded-full">
                                  <div 
                                    className="h-3 bg-blue-600 rounded-full transition-all duration-1000" 
                                    style={{ width: `${candidate.overallScore}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-blue-600 font-medium">ATS Score:</span>
                                  <span className="text-blue-900 ml-2 font-semibold">{candidate.atsScore}%</span>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">Semantic Score:</span>
                                  <span className="text-blue-900 ml-2 font-semibold">{candidate.semanticScore}%</span>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">Experience:</span>
                                  <span className="text-blue-900 ml-2">{candidate.experience} years</span>
                                </div>
                              </div>

                              <div className="mt-3">
                                <span className="text-blue-600 font-medium text-sm">Key Skills:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {candidate.skills.slice(0, 6).map((skill, skillIndex) => (
                                    <span key={skillIndex} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                      {skill}
                                    </span>
                                  ))}
                                  {candidate.skills.length > 6 && (
                                    <span className="text-blue-600 text-xs">+{candidate.skills.length - 6} more</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'feedback' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">AI-Generated Feedback</h3>
                        
                        {selectedCandidate ? (
                          <div className="space-y-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h4 className="font-semibold text-blue-900 mb-2">
                                Feedback for {selectedCandidate.name}
                              </h4>
                              <p className="text-blue-700">{selectedCandidate.feedback.overallAssessment}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-green-50 rounded-lg p-4">
                                <h5 className="font-semibold text-green-900 mb-3 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Strengths
                                </h5>
                                <ul className="space-y-2">
                                  {selectedCandidate.feedback.strengths.map((strength, index) => (
                                    <li key={index} className="text-green-700 text-sm">• {strength}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-red-50 rounded-lg p-4">
                                <h5 className="font-semibold text-red-900 mb-3 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Areas for Improvement
                                </h5>
                                <ul className="space-y-2">
                                  {selectedCandidate.feedback.weaknesses.map((weakness, index) => (
                                    <li key={index} className="text-red-700 text-sm">• {weakness}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-4">
                              <h5 className="font-semibold text-yellow-900 mb-3">Recommendations</h5>
                              <ul className="space-y-2">
                                {selectedCandidate.feedback.recommendations.map((rec, index) => (
                                  <li key={index} className="text-yellow-700 text-sm">• {rec}</li>
                                ))}
                              </ul>
                            </div>

                            {selectedCandidate.feedback.skillGaps.length > 0 && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h5 className="font-semibold text-blue-900 mb-3">Skill Gaps</h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedCandidate.feedback.skillGaps.map((skill, index) => (
                                    <span key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-blue-50 rounded-lg p-8 text-center">
                            <MessageSquare className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                            <p className="text-blue-600">Select a candidate from the Rankings tab to view detailed feedback</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'interviews' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-blue-900">Interview Management</h3>
                          <button
                            onClick={handleScheduleInterviews}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Interviews
                          </button>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-6">
                          <h4 className="font-semibold text-blue-900 mb-4">Recommended Candidates for Interview</h4>
                          <div className="space-y-3">
                            {results.filter(r => r.isRecommended).map((candidate, index) => (
                              <div key={candidate.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium text-blue-900">{candidate.name}</div>
                                    <div className="text-sm text-blue-600">{candidate.email}</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <div className="font-semibold text-blue-900">{candidate.overallScore}%</div>
                                    <div className="text-sm text-blue-600">Match Score</div>
                                  </div>
                                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200">
                                    Schedule
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="font-semibold text-blue-900 mb-4">Tavus AI Integration</h4>
                          <p className="text-blue-700 mb-4">
                            Enhance your interviews with AI-powered video interviews using Tavus technology.
                          </p>
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                            Configure Tavus AI
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}