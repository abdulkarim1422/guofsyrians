import { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

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
        company: '',
        description: ['']
      }]
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
          Projects
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
                title="Remove this project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Project Name and Company on same line */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                placeholder="E-commerce Platform, Mobile App, Website Redesign, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Company/Client
              </label>
              <input
                type="text"
                value={project.company}
                onChange={(e) => handleProjectChange(index, 'company', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                placeholder="Client Name, Personal Project, Company Name, etc."
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
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                required
              />
            </div>
            {!project.is_ongoing && (
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={project.end_date}
                  onChange={(e) => handleProjectChange(index, 'end_date', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                  required
                />
              </div>
            )}
            
            {/* Ongoing project checkbox */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`project-ongoing-${index}`}
                  checked={project.is_ongoing}
                  onChange={(e) => handleProjectOngoingChange(index, e.target.checked)}
                  className="w-4 h-4 text-rich-gold bg-white border-2 border-gray-200 rounded focus:ring-rich-gold focus:ring-2"
                />
                <label htmlFor={`project-ongoing-${index}`} className="text-sm font-medium text-carbon">
                  This project is ongoing
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Check this box if you're still working on this project
              </p>
            </div>
          </div>
          
          {/* Project Description */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-carbon">
                Project Description *
              </label>
              <button
                type="button"
                onClick={() => addProjectDescription(index)}
                className="text-deep-green hover:text-green-dark text-sm flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Description</span>
              </button>
            </div>
            {project.description.map((desc, descIndex) => (
              <div key={descIndex} className="mb-2 relative">
                <textarea
                  value={desc}
                  onChange={(e) => handleProjectDescriptionChange(index, descIndex, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all resize-none"
                  placeholder={`• Project feature or achievement ${descIndex + 1}`}
                  required={descIndex === 0}
                />
                {project.description.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProjectDescription(index, descIndex)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Remove this description"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-600 mt-1">
              Highlight key features, technologies used, and project outcomes
            </p>
          </div>
        </div>
      ))}
      
      {formData.projects.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No project entries yet. Click "Add Project" to get started.</p>
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
