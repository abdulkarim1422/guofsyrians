import { useState } from 'react';
import { Award, Plus, Trash2, X } from 'lucide-react';

export function ProjectsComponent({ formData, setFormData }) {
  // Validation helper for project dates
  const validateProjectDates = (startDate, endDate, isOngoing) => {
    if (!startDate) return true; // Start date is required, but handled by HTML validation
    
    if (!isOngoing && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return end >= start;
    }
    
    return true;
  };

  // Helper function to format project period for backend compatibility
  const formatProjectPeriod = (startDate, endDate, isOngoing) => {
    if (!startDate) return '';
    
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    };
    
    const formattedStart = formatDate(startDate);
    
    if (isOngoing) {
      return `${formattedStart} - Ongoing`;
    } else if (endDate) {
      const formattedEnd = formatDate(endDate);
      return `${formattedStart} - ${formattedEnd}`;
    } else {
      return formattedStart;
    }
  };

  // Enhanced handleProjectChange to include date validation
  const handleProjectChange = (index, field, value) => {
    setFormData(prev => {
      const updatedProjects = prev.projects.map((project, i) => {
        if (i === index) {
          const updatedProject = { ...project, [field]: value };
          
          // If changing start_date or end_date, validate dates
          if ((field === 'start_date' || field === 'end_date') && 
              !validateProjectDates(
                field === 'start_date' ? value : project.start_date,
                field === 'end_date' ? value : project.end_date,
                project.is_ongoing
              )) {
            // You could add an error state here if needed
            console.warn('End date must be after start date');
          }
          
          return updatedProject;
        }
        return project;
      });
      
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  const handleProjectDescriptionChange = (projectIndex, descIndex, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex ? {
          ...project,
          description: project.description.map((desc, j) => 
            j === descIndex ? value : desc
          )
        } : project
      )
    }));
  };

  const addProjectEntry = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        start_date: '',
        end_date: '',
        is_ongoing: false,
        project_type: 'personal',
        project_status: 'ongoing',
        company: '',
        role: '',
        tools: [],
        newTool: '',
        responsibilities: '',
        outcomes: '',
        description: ['']
      }]
    }));
  };

  // New handlers for project tools
  const addProjectTool = (projectIndex) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => {
        if (i === projectIndex && project.newTool?.trim()) {
          const newTools = [...(project.tools || []), project.newTool.trim()];
          return {
            ...project,
            tools: newTools,
            newTool: ''
          };
        }
        return project;
      })
    }));
  };

  const removeProjectTool = (projectIndex, toolIndex) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex ? {
          ...project,
          tools: (project.tools || []).filter((_, j) => j !== toolIndex)
        } : project
      )
    }));
  };

  const removeProjectEntry = (index) => {
    if (formData.projects.length > 1) {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index)
      }));
    }
  };

  const addProjectDescription = (projectIndex) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex ? {
          ...project,
          description: [...project.description, '']
        } : project
      )
    }));
  };

  const removeProjectDescription = (projectIndex, descIndex) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex ? {
          ...project,
          description: project.description.filter((_, j) => j !== descIndex)
        } : project
      )
    }));
  };

  const handleProjectOngoingChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { 
          ...project, 
          is_ongoing: value,
          // Clear end_date if project is ongoing
          end_date: value ? '' : project.end_date
        } : project
      )
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-carbon flex items-center">
          <Award className="w-6 h-6 mr-2 text-rich-gold" />
          المشاريع
        </h2>
      </div>
      
      {formData.projects.map((project, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 bg-sand">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon">Project {index + 1}</h3>
            {formData.projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeProjectEntry(index)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                title="إزالة هذا المشروع"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Project Name and Type on same line */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                اسم المشروع *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                placeholder="منصة تجارة إلكترونية، تطبيق جوال، إعادة تصميم موقع، إلخ."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                نوع المشروع *
              </label>
              <select
                value={project.project_type || 'personal'}
                onChange={(e) => handleProjectChange(index, 'project_type', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                required
              >
                <option value="graduation">مشروع التخرج</option>
                <option value="internship">مشروع التدريب</option>
                <option value="freelance">عمل حر</option>
                <option value="volunteer">مشروع تطوعي</option>
                <option value="personal">مشروع شخصي</option>
                <option value="professional">عمل مهني</option>
                <option value="academic">بحث أكاديمي</option>
                <option value="open_source">مساهمة مفتوحة المصدر</option>
              </select>
            </div>
            
            {/* Company/Client and Role */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                الشركة/العميل
              </label>
              <input
                type="text"
                value={project.company}
                onChange={(e) => handleProjectChange(index, 'company', e.target.value)}
                className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all text-sm sm:text-base"
                placeholder="Client Name, Personal Project, Company Name, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Your Role *
              </label>
              <input
                type="text"
                value={project.role || ''}
                onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all text-sm sm:text-base"
                placeholder="Lead Developer, UI/UX Designer, Project Manager, etc."
                required
              />
            </div>
            
            {/* Date fields */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={project.start_date}
                onChange={(e) => handleProjectChange(index, 'start_date', e.target.value)}
                className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all text-sm sm:text-base"
                required
              />
            </div>
            {!project.is_ongoing && (
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">
                  End Date {project.project_status === 'completed' || project.project_status === 'expected' ? '*' : ''}
                </label>
                <input
                  type="date"
                  value={project.end_date}
                  onChange={(e) => handleProjectChange(index, 'end_date', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                  required={project.project_status === 'completed' || project.project_status === 'expected'}
                />
              </div>
            )}
            
            {/* Project Status */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Project Status *
              </label>
              <select
                value={project.project_status || 'ongoing'}
                onChange={(e) => handleProjectChange(index, 'project_status', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                required
              >
                <option value="ongoing">جاري</option>
                <option value="completed">مكتمل</option>
                <option value="expected">الإكمال المتوقع</option>
                <option value="paused">متوقف</option>
              </select>
            </div>
          </div>
          
          {/* Tools/Technologies Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-carbon">
                Tools & Technologies *
              </label>
              <button
                type="button"
                onClick={() => addProjectTool(index)}
                className="text-deep-green hover:text-green-dark text-sm flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tool</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {(project.tools || []).map((tool, toolIndex) => (
                <div key={toolIndex} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                  <span className="text-sm text-carbon">{tool}</span>
                  <button
                    type="button"
                    onClick={() => removeProjectTool(index, toolIndex)}
                    className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                    title="إزالة هذه الأداة"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={project.newTool || ''}
              onChange={(e) => handleProjectChange(index, 'newTool', e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addProjectTool(index);
                }
              }}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
              placeholder="Type technology name and press Enter (e.g., React, Python, Figma)"
            />
            <p className="text-xs text-gray-600 mt-1">
              Add technologies, frameworks, tools, or languages used in this project
            </p>
          </div>
          
          {/* Role & Responsibilities */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-carbon mb-2">
              Role & Responsibilities *
            </label>
            <textarea
              value={project.responsibilities || ''}
              onChange={(e) => handleProjectChange(index, 'responsibilities', e.target.value)}
              rows={3}
              className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all resize-none text-sm sm:text-base"
              placeholder="Describe your specific role and key responsibilities in this project..."
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              Detail what you were responsible for and how you contributed to the project
            </p>
          </div>
          
          {/* Results/Outcomes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-carbon mb-2">
              Results/Outcomes
            </label>
            <textarea
              value={project.outcomes || ''}
              onChange={(e) => handleProjectChange(index, 'outcomes', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all resize-none"
              placeholder="Describe the project outcomes, impact, metrics, or achievements..."
            />
            <p className="text-xs text-gray-600 mt-1">
              Include quantifiable results, user feedback, performance metrics, or business impact
            </p>
          </div>
        </div>
      ))}
      
      {formData.projects.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد إدخالات مشاريع بعد. انقر على &quot;إضافة مشروع&quot; للبدء.</p>
        </div>
      )}
      
      {/* Add Project Button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={addProjectEntry}
          className="bg-deep-green hover:bg-green-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>
    </div>
  );
}
