import React from 'react';
import WorkExperienceComponent from '@/components/form-components/WorkExperienceComponent';
import { ProjectsComponent } from '@/components/form-components/ProjectsComponent';
import { AcademicInputComponent } from '@/components/form-components/AcademicInputComponent';

// Simple test component to verify all enhanced components work
export const ComponentTest = () => {
  const [testFormData, setTestFormData] = React.useState({
    works: [{
      title: 'Test Job',
      company: 'Test Company', 
      period: '2023-2024',
      responsibilities: 'Test responsibilities',
      achievements: 'Test achievements',
      description: ['Legacy description']
    }],
    projects: [{
      name: 'Test Project',
      company: 'Test Company',
      period: '2023-2024', 
      project_type: 'web',
      tools: ['React', 'Python'],
      role: 'Developer',
      responsibilities: 'Test responsibilities',
      outcomes: 'Test outcomes',
      description: ['Legacy description']
    }],
    academic: [{
      degree: 'Bachelor',
      field: 'Computer Science',
      university: 'Test University',
      graduation_year: '2023',
      gpa: '3.8',
      rank: 'High Honors'
    }]
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Component Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Work Experience Component</h2>
        <WorkExperienceComponent 
          formData={testFormData} 
          setFormData={setTestFormData} 
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Projects Component</h2>
        <ProjectsComponent 
          formData={testFormData} 
          setFormData={setTestFormData} 
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Academic Component</h2>
        <AcademicInputComponent 
          formData={testFormData} 
          setFormData={setTestFormData} 
        />
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Current Form Data:</h3>
        <pre className="text-sm overflow-auto max-h-96">
          {JSON.stringify(testFormData, null, 2)}
        </pre>
      </div>
    </div>
  );
};
