import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Users, Zap, Download, Mail, BarChart3, Clock, Target } from 'lucide-react';

export default function DemoDashboard() {
  const [jobDescription, setJobDescription] = useState('');
  const [vacancies, setVacancies] = useState(1);
  const [uploadedCVs, setUploadedCVs] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedCVs(prev => [...prev, ...files]);
  };

  const removeCV = (index: number) => {
    setUploadedCVs(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || uploadedCVs.length === 0) {
      alert('Please provide job description and upload at least one CV');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    const mockResults = [
      { name: 'Sarah Johnson', score: 95, match: 'Excellent Match', skills: ['React', 'TypeScript', 'Node.js'], experience: '5 years', email: 'sarah.johnson@email.com' },
      { name: 'Michael Chen', score: 87, match: 'Good Match', skills: ['JavaScript', 'Python', 'AWS'], experience: '4 years', email: 'michael.chen@email.com' },
      { name: 'Emily Davis', score: 82, match: 'Good Match', skills: ['Vue.js', 'PHP', 'MySQL'], experience: '3 years', email: 'emily.davis@email.com' },
      { name: 'David Wilson', score: 76, match: 'Fair Match', skills: ['HTML', 'CSS', 'jQuery'], experience: '2 years', email: 'david.wilson@email.com' },
      { name: 'Lisa Anderson', score: 71, match: 'Fair Match', skills: ['Angular', 'Java', 'Spring'], experience: '3 years', email: 'lisa.anderson@email.com' }
    ].slice(0, uploadedCVs.length);

    setResults(mockResults);
    setIsAnalyzing(false);
  };

  const handleScheduleInterviews = () => {
    const topCandidates = results.slice(0, vacancies);
    alert(`Scheduling interviews with top ${vacancies} candidate(s): ${topCandidates.map(c => c.name).join(', ')}`);
  };

  const handleDownloadReport = () => {
    alert('Downloading detailed analysis report...');
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
                  <h1 className="text-2xl font-bold text-blue-900">CVAlign Demo Dashboard</h1>
                  <p className="text-blue-600">Experience AI-powered CV matching in action</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Job Requirements
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste your job description here..."
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
                disabled={isAnalyzing || !jobDescription.trim() || uploadedCVs.length === 0}
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
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-blue-600 text-sm font-medium">Top Match</p>
                      <p className="text-2xl font-bold text-blue-900">{Math.max(...results.map(r => r.score))}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Analysis Time</p>
                      <p className="text-2xl font-bold text-blue-900">3.2s</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Candidate Rankings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-blue-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Candidate Rankings
                </h2>
                {results.length > 0 && (
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
                )}
              </div>

              {results.length === 0 ? (
                <div className="bg-blue-50 rounded-lg p-12 text-center">
                  <Users className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Ready to Analyze</h3>
                  <p className="text-blue-600">Upload CVs and add a job description to see AI-powered candidate rankings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((candidate, index) => (
                    <div key={index} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            index < vacancies ? 'bg-blue-600' : 'bg-blue-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-blue-900 text-lg">{candidate.name}</div>
                            <div className="text-sm text-blue-600">{candidate.email}</div>
                          </div>
                          {index < vacancies && (
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                              Recommended
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-900 text-2xl">{candidate.score}%</div>
                          <div className="text-sm text-blue-600">{candidate.match}</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="w-full h-3 bg-blue-200 rounded-full">
                          <div 
                            className="h-3 bg-blue-600 rounded-full transition-all duration-1000" 
                            style={{ width: `${candidate.score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600 font-medium">Experience:</span>
                          <span className="text-blue-900 ml-2">{candidate.experience}</span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">Key Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {candidate.skills.map((skill: string, skillIndex: number) => (
                              <span key={skillIndex} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}