import { useState } from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

export function WorkExperienceComponent({ formData, setFormData }) {
  // Validation helper for work experience dates
  const validateWorkDates = (startDate, endDate, currentlyWorking) => {
    if (!startDate) return true; // Start date is required, but handled by HTML validation
    
    if (!currentlyWorking && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return end >= start;
    }
    
    return true;
  };

  // Helper function to format work period for backend compatibility
  const formatWorkPeriod = (startDate, endDate, currentlyWorking) => {
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
    
    if (currentlyWorking) {
      return `${formattedStart} - Present`;
    } else if (endDate) {
      const formattedEnd = formatDate(endDate);
      return `${formattedStart} - ${formattedEnd}`;
    } else {
      return formattedStart;
    }
  };

  // Enhanced handleWorkChange to include date validation
  const handleWorkChange = (index, field, value) => {
    setFormData(prev => {
      const updatedWorks = prev.works.map((work, i) => {
        if (i === index) {
          const updatedWork = { ...work, [field]: value };
          
          // If changing start_date or end_date, validate dates
          if ((field === 'start_date' || field === 'end_date') && 
              !validateWorkDates(
                field === 'start_date' ? value : work.start_date,
                field === 'end_date' ? value : work.end_date,
                work.currently_working
              )) {
            // You could add an error state here if needed
            console.warn('End date must be after start date');
          }
          
          return updatedWork;
        }
        return work;
      });
      
      return {
        ...prev,
        works: updatedWorks
      };
    });
  };

  const handleWorkDescriptionChange = (workIndex, descIndex, value) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === workIndex ? {
          ...work,
          description: work.description.map((desc, j) => 
            j === descIndex ? value : desc
          )
        } : work
      )
    }));
  };

  const addWorkEntry = () => {
    setFormData(prev => ({
      ...prev,
      works: [...prev.works, {
        title: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        company: '',
        description: ['']
      }]
    }));
  };

  const removeWorkEntry = (index) => {
    if (formData.works.length > 1) {
      setFormData(prev => ({
        ...prev,
        works: prev.works.filter((_, i) => i !== index)
      }));
    }
  };

  const addWorkDescription = (workIndex) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === workIndex ? {
          ...work,
          description: [...work.description, '']
        } : work
      )
    }));
  };

  const removeWorkDescription = (workIndex, descIndex) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === workIndex ? {
          ...work,
          description: work.description.filter((_, j) => j !== descIndex)
        } : work
      )
    }));
  };

  const handleWorkCurrentlyWorkingChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === index ? { 
          ...work, 
          currently_working: value,
          // Clear end_date if currently working
          end_date: value ? '' : work.end_date
        } : work
      )
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-carbon flex items-center">
          <Briefcase className="w-6 h-6 mr-2 text-rich-gold" />
          Work Experience
        </h2>
      </div>
      
      {formData.works.map((work, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 bg-sand">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-carbon">Position {index + 1}</h3>
            {formData.works.length > 1 && (
              <button
                type="button"
                onClick={() => removeWorkEntry(index)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                title="Remove this work experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Job Title and Company on same line */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={work.title}
                onChange={(e) => handleWorkChange(index, 'title', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                placeholder="Full-Stack Developer, Software Engineer, Data Scientist, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Company *
              </label>
              <input
                type="text"
                value={work.company}
                onChange={(e) => handleWorkChange(index, 'company', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                placeholder="Company Name, Organization, etc."
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
                value={work.start_date}
                onChange={(e) => handleWorkChange(index, 'start_date', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                End Date {work.currently_working ? '(Currently Working)' : '*'}
              </label>
              <input
                type="date"
                value={work.end_date}
                onChange={(e) => handleWorkChange(index, 'end_date', e.target.value)}
                className={`w-full px-4 py-3 border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all ${
                  work.currently_working 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white'
                }`}
                disabled={work.currently_working}
                required={!work.currently_working}
                placeholder={work.currently_working ? 'Currently working here' : ''}
              />
            </div>
            
            {/* Currently working checkbox */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`currently-working-${index}`}
                  checked={work.currently_working}
                  onChange={(e) => handleWorkCurrentlyWorkingChange(index, e.target.checked)}
                  className="w-4 h-4 text-rich-gold bg-white border-2 border-gray-200 rounded focus:ring-rich-gold focus:ring-2"
                />
                <label htmlFor={`currently-working-${index}`} className="text-sm font-medium text-carbon">
                  I currently work here
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Check this box if you're still employed at this position
              </p>
            </div>
          </div>
          
          {/* Job Description */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-carbon">
                Job Description *
              </label>
              <button
                type="button"
                onClick={() => addWorkDescription(index)}
                className="text-deep-green hover:text-green-dark text-sm flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Description</span>
              </button>
            </div>
            {work.description.map((desc, descIndex) => (
              <div key={descIndex} className="mb-2 relative">
                <textarea
                  value={desc}
                  onChange={(e) => handleWorkDescriptionChange(index, descIndex, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all resize-none"
                  placeholder={`• Key responsibility or achievement ${descIndex + 1}`}
                  required={descIndex === 0}
                />
                {work.description.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWorkDescription(index, descIndex)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Remove this description"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-600 mt-1">
              Add multiple bullet points to highlight key achievements and responsibilities
            </p>
          </div>
        </div>
      ))}
      
      {formData.works.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No work experience entries yet. Click "Add Position" to get started.</p>
        </div>
      )}
      
      {/* Add Position Button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={addWorkEntry}
          className="bg-deep-green hover:bg-green-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>
    </div>
  );
}
