

const ResumeModal = ({ isOpen, onClose, resumeData, loading, error }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  };

  const formatList = (items) => {
    if (!items || !Array.isArray(items)) return [];
    return items.filter(item => item && item.trim());
  };

  if (!resumeData && !loading && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">السيرة الذاتية</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">جاري تحميل السيرة الذاتية...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">خطأ في تحميل السيرة الذاتية</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {resumeData && !loading && !error && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-gray-700">الاسم:</span> <span className="text-gray-900">{resumeData.member?.name || 'غير محدد'}</span></div>
                  <div><span className="font-medium text-gray-700">المسمى الوظيفي:</span> <span className="text-gray-900">{resumeData.member?.professional_title || 'غير محدد'}</span></div>
                  <div><span className="font-medium text-gray-700">المدينة:</span> <span className="text-gray-900">{resumeData.member?.city || 'غير محدد'}</span></div>
                  <div><span className="font-medium text-gray-700">الهاتف:</span> <span className="text-gray-900">{resumeData.member?.phone || 'غير محدد'}</span></div>
                  <div><span className="font-medium text-gray-700">البريد الإلكتروني:</span> <span className="text-gray-900">{resumeData.member?.email || 'غير محدد'}</span></div>
                  {resumeData.member?.birthdate && (
                    <div><span className="font-medium text-gray-700">تاريخ الميلاد:</span> <span className="text-gray-900">{formatDate(resumeData.member.birthdate)}</span></div>
                  )}
                </div>
                
                {resumeData.member?.about && (
                  <div className="mt-4">
                    <div className="font-medium text-gray-700 mb-2">نبذة تعريفية:</div>
                    <p className="text-gray-900 whitespace-pre-wrap">{resumeData.member.about}</p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {resumeData.member?.skills && resumeData.member.skills.length > 0 && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-4">المهارات</h3>
                  <div className="flex flex-wrap gap-2">
                    {formatList(resumeData.member.skills).map((skill, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {resumeData.work_experiences && resumeData.work_experiences.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-purple-900 mb-4">الخبرات العملية</h3>
                  <div className="space-y-4">
                    {resumeData.work_experiences.map((exp, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <h4 className="font-semibold text-purple-900">{exp.title}</h4>
                          <span className="text-sm text-purple-600">{exp.period}</span>
                        </div>
                        <p className="text-purple-700 font-medium mb-2">{exp.company}</p>
                        
                        {exp.responsibilities && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">المسؤوليات:</span>
                            <p className="text-gray-600 text-sm mt-1">{exp.responsibilities}</p>
                          </div>
                        )}
                        
                        {exp.achievements && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">الإنجازات:</span>
                            <p className="text-gray-600 text-sm mt-1">{exp.achievements}</p>
                          </div>
                        )}
                        
                        {exp.description && Array.isArray(exp.description) && exp.description.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">الوصف:</span>
                            <ul className="text-gray-600 text-sm mt-1 list-disc list-inside">
                              {formatList(exp.description).map((desc, i) => (
                                <li key={i}>{desc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-orange-900 mb-4">التعليم</h3>
                  <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <h4 className="font-semibold text-orange-900">{edu.degreeLevel}</h4>
                          <span className="text-sm text-orange-600">{edu.date}</span>
                        </div>
                        <p className="text-orange-700 font-medium mb-1">{edu.major}</p>
                        <p className="text-orange-600 text-sm">{edu.institution}</p>
                        {edu.gpa && (
                          <p className="text-orange-600 text-sm mt-1">المعدل: {edu.gpa}/4.0</p>
                        )}
                        {edu.rank && (
                          <p className="text-orange-600 text-sm">التقدير: {edu.rank}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-indigo-900 mb-4">المشاريع</h3>
                  <div className="space-y-4">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-indigo-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <h4 className="font-semibold text-indigo-900">{project.name}</h4>
                          <span className="text-sm text-indigo-600">{project.period}</span>
                        </div>
                        
                        {project.company && (
                          <p className="text-indigo-700 font-medium mb-2">{project.company}</p>
                        )}
                        
                        {project.project_type && (
                          <p className="text-indigo-600 text-sm mb-2">نوع المشروع: {project.project_type}</p>
                        )}
                        
                        {project.role && (
                          <p className="text-indigo-600 text-sm mb-2">الدور: {project.role}</p>
                        )}
                        
                        {project.tools && project.tools.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">الأدوات والتقنيات:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.tools.map((tool, i) => (
                                <span key={i} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {project.responsibilities && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">المسؤوليات:</span>
                            <p className="text-gray-600 text-sm mt-1">{project.responsibilities}</p>
                          </div>
                        )}
                        
                        {project.outcomes && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">النتائج:</span>
                            <p className="text-gray-600 text-sm mt-1">{project.outcomes}</p>
                          </div>
                        )}
                        
                        {project.description && Array.isArray(project.description) && project.description.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">الوصف:</span>
                            <ul className="text-gray-600 text-sm mt-1 list-disc list-inside">
                              {formatList(project.description).map((desc, i) => (
                                <li key={i}>{desc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {resumeData.member?.interests && resumeData.member.interests.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-yellow-900 mb-4">الاهتمامات</h3>
                  <div className="flex flex-wrap gap-2">
                    {formatList(resumeData.member.interests).map((interest, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {resumeData.member?.languages && resumeData.member.languages.length > 0 && (
                <div className="bg-cyan-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-cyan-900 mb-4">اللغات</h3>
                  <div className="flex flex-wrap gap-2">
                    {formatList(resumeData.member.languages).map((language, index) => (
                      <span key={index} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;