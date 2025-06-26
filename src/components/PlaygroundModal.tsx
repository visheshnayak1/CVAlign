import React, { useState } from 'react';
import { X, Upload, FileText, Users, Zap, Download, Mail } from 'lucide-react';

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaygroundModal({ isOpen, onClose }: PlaygroundModalProps) {
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
      { name: 'Sarah Johnson', score: 95, match: 'Excellent Match', skills: ['React', 'TypeScript', 'Node.js'], experience: '5 years' },
      { name: 'Michael Chen', score: 87, match: 'Good Match', skills: ['JavaScript', 'Python', 'AWS'], experience: '4 years' },
      { name: 'Emily Davis', score: 82, match: 'Good Match', skills: ['Vue.js', 'PHP', 'MySQL'], experience: '3 years' },
      { name: 'David Wilson', score: 76, match: 'Fair Match', skills: ['HTML', 'CSS', 'jQuery'], experience: '2 years' },
      { name: 'Lisa Anderson', score: 71, match: 'Fair Match', skills: ['Angular', 'Java', 'Spring'], experience: '3 years' }
    ].slice(0, uploadedCVs.length);

    setResults(mockResults);
    setIsAnalyzing(false);
  };

  const handleScheduleInterviews = () => {
    const topCandidates = results.slice(0, vacancies);
    alert(`Scheduling interviews with top ${vacancies} candidate(s): ${topCandidates.map(c => c.name).join(', ')}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-blue-100 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900">CVAlign Playground</h2>
              <p className="text-blue-600">Test our AI-powered CV matching system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-3">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste your job description here..."
                  className="w-full h-40 p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-3">
                  Number of Vacancies
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

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-3">
                  Upload CVs
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-600 mb-2">Drop CV files here or click to browse</p>
                  <p className="text-sm text-blue-500">Supports PDF, DOC, DOCX files</p>
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
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                  >
                    Choose Files
                  </label>
                </div>

                {uploadedCVs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-blue-900">Uploaded CVs ({uploadedCVs.length})</p>
                    {uploadedCVs.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="text-blue-900 text-sm">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeCV(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim() || uploadedCVs.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center"
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

            {/* Results Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-900">Candidate Rankings</h3>
                {results.length > 0 && (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
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
                <div className="bg-blue-50 rounded-lg p-8 text-center">
                  <Users className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-blue-600">Upload CVs and job description to see AI-powered rankings</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.map((candidate, index) => (
                    <div key={index} className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            index < vacancies ? 'bg-blue-600' : 'bg-blue-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">{candidate.name}</div>
                            <div className="text-sm text-blue-600">{candidate.match}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-900 text-lg">{candidate.score}%</div>
                          <div className="w-20 h-2 bg-blue-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-600 rounded-full transition-all duration-500" 
                              style={{ width: `${candidate.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600 font-medium">Experience:</span>
                          <span className="text-blue-900 ml-1">{candidate.experience}</span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {candidate.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
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