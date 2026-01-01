'use client';

import { useEffect } from 'react';
import Button from './ui/Button';
import Card, { CardHeader, CardBody } from './ui/Card';
import Badge from './ui/Badge';

export default function EnhancedPreviewModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  originalProfile, 
  enhancedProfile,
  isLoading 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI-Enhanced Resume Preview</h2>
            <p className="text-sm text-gray-600 mt-1">
              Review your ATS-optimized content before downloading
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Enhancing your resume with AI...</p>
                <p className="text-sm text-gray-500 mt-2">This may take 5-10 seconds</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Experience Section */}
              {enhancedProfile?.experience && enhancedProfile.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                    <Badge variant="success" className="ml-2">AI Enhanced</Badge>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-6">
                      {enhancedProfile.experience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-blue-500 pl-4">
                          <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          
                          <div className="mt-3 space-y-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Original</p>
                              <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                                {originalProfile.experience[idx]?.description?.split('\n').map((bullet, i) => (
                                  bullet.trim() && <p key={i} className="mb-1">• {bullet.trim()}</p>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-xs font-medium text-green-600 uppercase mb-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                AI Enhanced
                              </p>
                              <div className="bg-green-50 p-3 rounded text-sm text-gray-900 border border-green-200">
                                {exp.description?.split('\n').map((bullet, i) => (
                                  bullet.trim() && <p key={i} className="mb-1 font-medium">• {bullet.trim()}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Projects Section */}
              {enhancedProfile?.projects && enhancedProfile.projects.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                    <Badge variant="success" className="ml-2">AI Enhanced</Badge>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-6">
                      {enhancedProfile.projects.map((project, idx) => (
                        <div key={idx} className="border-l-2 border-purple-500 pl-4">
                          <h4 className="font-semibold text-gray-900">{project.name}</h4>
                          {project.tech_stack && (
                            <p className="text-sm text-gray-600">{project.tech_stack}</p>
                          )}
                          
                          <div className="mt-3 space-y-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Original</p>
                              <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                                {originalProfile.projects[idx]?.description?.split('\n').map((bullet, i) => (
                                  bullet.trim() && <p key={i} className="mb-1">• {bullet.trim()}</p>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-xs font-medium text-green-600 uppercase mb-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                AI Enhanced
                              </p>
                              <div className="bg-green-50 p-3 rounded text-sm text-gray-900 border border-green-200">
                                {project.description?.split('\n').map((bullet, i) => (
                                  bullet.trim() && <p key={i} className="mb-1 font-medium">• {bullet.trim()}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Enhancement Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardBody>
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">What changed?</p>
                      <ul className="text-blue-800 space-y-1">
                        <li>✓ Added action verbs (Developed, Led, Implemented)</li>
                        <li>✓ Included quantifiable metrics (%, numbers, impact)</li>
                        <li>✓ Highlighted technical skills and tools</li>
                        <li>✓ Optimized for ATS keyword scanning</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Enhancing...' : 'Download Enhanced PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}
