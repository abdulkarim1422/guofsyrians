import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Send, User, MessageSquare, Briefcase, GraduationCap, Code, Award, Globe, Plus, Trash2 } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { MailInputComponent } from '@/components/form-components/MailInputComponent';
import { PhoneInputComponent } from '@/components/form-components/PhoneInputComponent';
import { SkillsInputComponent } from '@/components/form-components/SkillsInputComponent';
import { InterestsInputComponent } from '@/components/form-components/InterestsInputComponent';
import { SocialInputComponent } from '@/components/form-components/SocialInputComponent';
import { WorkExperienceComponent } from '@/components/form-components/WorkExperienceComponent';
import { ProjectsComponent } from '@/components/form-components/ProjectsComponent';
import { AcademicInputComponent } from '@/components/form-components/AcademicInputComponent';
import { getMemberImageUrl, getDefaultAvatarPath } from '@/utils/imageUtils';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';

export const ResumeForm = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memberId, setMemberId] = useState(null); // Store member ID for updates
  
  const [formData, setFormData] = useState({
    // Profile data - using backend field names
    name: '',
    professional_title: '', // was occupation
    birthdate: '',
    sex: '', // Required field for gender
    city: '', // was location
    email: '',
    phone: '+90 ', // was telephone
    countryCode: '+90',
    image: '',
    imageFile: null,
    relocateToSyria: '',
    
    // About Me
    aboutLabel: '', // Initialize aboutLabel field
    bio: '', // was aboutDescription
    
    // Skills
    skills: [],
    
    // Interests
    interests: [],
    
    // Social Media - using social_media object structure
    social_media: {},
    
    // Work Experience
    works: [
      {
        title: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        company: '',
        description: ['']
      }
    ],
    
    // Academic
    academic: [
      {
        degreeLevel: '',
        major: '',
        date: '',
        institution: ''
      }
    ],
    
    // Projects
    projects: [
      {
        name: '',
        start_date: '',
        end_date: '',
        is_ongoing: false,
        company: '',
        description: ['']
      }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Ensure scrolling is enabled when this component mounts
  useEffect(() => {
    // Reset any global overflow restrictions
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    return () => {
      // Don't reset on unmount as other pages might need different behavior
    };
  }, []);

  // Load existing resume data if user is authenticated
  useEffect(() => {
    const loadExistingResumeData = async () => {
      if (!isAuthenticated || !user?.id) {
        console.log('User not authenticated or user ID not available');
        return;
      }

      setIsLoadingExistingData(true);
      
      try {
        // Get resume data directly by user_id
        console.log('Fetching resume data for user:', user.id);
        const resumeResponse = await api.get(`/api/resume/by-user-id/${user.id}`);
        const resumeData = resumeResponse.data;
        console.log('Resume data loaded:', resumeData);
        
        // Extract member data and related data from the response
        const memberData = resumeData.member || {};
        const workExperiences = resumeData.work_experiences || [];
        const education = resumeData.education || [];
        const projects = resumeData.projects || [];

        // Store member ID for future updates
        if (memberData._id) {
          setMemberId(memberData._id);
        }

        setIsEditMode(true);

        // Populate form with existing data
        setFormData(prevData => ({
          ...prevData,
          // Profile data from member
          name: memberData.name || '',
          professional_title: memberData.professional_title || '',
          birthdate: memberData.birthdate ? memberData.birthdate.split('T')[0] : '',
          sex: memberData.sex || '',
          city: memberData.city || '',
          email: memberData.email || '',
          phone: memberData.phone || '+90 ',
          image: memberData.image || '',
          relocateToSyria: memberData.relocateToSyria || '',
          bio: memberData.bio || '',
          skills: memberData.skills || [],
          interests: memberData.interests || [],
          social_media: memberData.social_media || {},
          
          // Transform work experiences from backend format
          works: workExperiences.length > 0 ? workExperiences.map(work => ({
            title: work.job_title || '',
            start_date: work.start_date ? work.start_date.split('T')[0] : '',
            end_date: work.end_date ? work.end_date.split('T')[0] : '',
            currently_working: !work.end_date,
            company: work.company || '',
            description: work.description ? [work.description] : ['']
          })) : [{
            title: '',
            start_date: '',
            end_date: '',
            currently_working: false,
            company: '',
            description: ['']
          }],

          // Transform education from backend format
          academic: education.length > 0 ? education.map(edu => ({
            degreeLevel: edu.degree || '',
            major: edu.field_of_study || '',
            date: edu.end_date ? edu.end_date.split('T')[0] : '',
            institution: edu.institution || ''
          })) : [{
            degreeLevel: '',
            major: '',
            date: '',
            institution: ''
          }],

          // Transform projects from backend format
          projects: projects.length > 0 ? projects.map(project => ({
            name: project.project_name || '',
            start_date: project.start_date ? project.start_date.split('T')[0] : '',
            end_date: project.end_date ? project.end_date.split('T')[0] : '',
            is_ongoing: !project.end_date,
            company: project.role || '',
            description: project.description ? [project.description] : ['']
          })) : [{
            name: '',
            start_date: '',
            end_date: '',
            is_ongoing: false,
            company: '',
            description: ['']
          }]
        }));
      } catch (error) {
        console.error('Error loading existing resume data:', error);
        if (error.response?.status === 404) {
          console.log('No resume found for this user - will create new one');
        }
        // If error, just continue with empty form
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    loadExistingResumeData();
  }, [isAuthenticated, user?.id]);

  const turkishCities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta',
    'İçel (Mersin)', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
    'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
    'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
    'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        image: file.name
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      image: '' // Clear both uploaded file and existing image path
    }));
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('imageFile');
    if (fileInput) fileInput.value = '';
  };

  const handleProjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
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
        company: '',
        period: '',
        description: ['']
      }]
    }));
  };

  const removeProjectEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields before submission
      if (!formData.sex) {
        setSubmitStatus('error');
        setSubmitMessage('Please select your gender');
        setIsSubmitting(false);
        return;
      }

      if (!formData.name.trim()) {
        setSubmitStatus('error');
        setSubmitMessage('Please enter your full name');
        setIsSubmitting(false);
        return;
      }

      if (!formData.professional_title.trim()) {
        setSubmitStatus('error');
        setSubmitMessage('Please enter your professional title');
        setIsSubmitting(false);
        return;
      }

      // Phone validation function
      const isValidPhone = (phone) => {
        const phoneRegex = /^\+\d{7,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
      };

      // Validate phone number before submission
      if (!isValidPhone(formData.phone)) {
        setSubmitStatus('error');
        setSubmitMessage('Please enter a valid phone number (7-15 digits after country code)');
        setIsSubmitting(false);
        return;
      }

      // Prepare the data in the format expected by the backend
      const resumeData = {
        name: formData.name.trim(),
        professional_title: formData.professional_title.trim(),
        birthdate: formData.birthdate || null,
        sex: formData.sex, // Required: "male" or "female"
        city: formData.city || null,
        email: formData.email || null,
        phone: formData.phone.replace(/\s/g, ''), // Clean phone number (remove spaces)
        image: formData.image || null,
        relocateToSyria: formData.relocateToSyria || null,
        bio: formData.bio || null,
        skills: formData.skills && formData.skills.length > 0 ? formData.skills : [],
        interests: formData.interests && formData.interests.length > 0 ? formData.interests : [],
        social_media: formData.social_media || {},
        works: formData.works
          .filter(work => work.title && work.company && work.start_date)
          .map(work => ({
            title: work.title,
            company: work.company,
            description: work.description.filter(desc => desc.trim() !== ''),
            period: formatWorkPeriod(work.start_date, work.end_date, work.currently_working)
          })),
        academic: formData.academic.filter(edu => edu.degreeLevel && edu.institution),
        projects: formData.projects
          .filter(proj => proj.name && proj.start_date)
          .map(proj => ({
            name: proj.name,
            company: proj.company,
            description: proj.description.filter(desc => desc.trim() !== ''),
            period: formatProjectPeriod(proj.start_date, proj.end_date, proj.is_ongoing)
          }))
      };

      console.log('Sending resume data:', resumeData);
      console.log('Form validation - sex:', formData.sex, 'name:', formData.name, 'professional_title:', formData.professional_title, 'birthdate:', formData.birthdate);

      // Get API base URL from environment or use default
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8222';

      let response;
      
      if (isEditMode && memberId) {
        // Update existing resume using member ID
        response = await api.put(`/api/resume/${memberId}`, resumeData);
      } else {
        // Create new resume (public endpoint)
        response = await fetch(`${API_BASE_URL}/api/resume/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resumeData)
        });

        if (!response.ok) {
          let errorMessage = 'Failed to submit resume';
          try {
            const error = await response.json();
            console.error('Backend error response:', error);
            errorMessage = error.detail || error.message || errorMessage;
            
            // Handle validation errors specifically
            if (response.status === 422) {
              if (typeof error.detail === 'string') {
                errorMessage = `Validation Error: ${error.detail}`;
              } else if (Array.isArray(error.detail)) {
                // Handle Pydantic validation errors
                const validationErrors = error.detail.map(err => 
                  `${err.loc?.join(' → ') || 'Field'}: ${err.msg}`
                ).join(', ');
                errorMessage = `Validation Errors: ${validationErrors}`;
              }
            }
          } catch (e) {
            // If response is not JSON, use status text
            console.error('Error parsing error response:', e);
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        response = { data: await response.json() };
      }
      
      const result = response.data;
      console.log('Resume submitted successfully:', result);
      
      setSubmitStatus('success');
      const successMessage = isEditMode ? 
        'Resume updated successfully!' : 
        result.message || 'Resume submitted successfully!';
      setSubmitMessage(successMessage);
    } catch (error) {
      console.error('Error submitting resume:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to submit resume. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
    }
  };

  return (
    <>
      <SEO 
        name="Resume Form"
        ocupation="FullStack Software Developer"
        location="Istanbul, Turkey"
        description="Edit and update resume information including profile, skills, experience, and projects."
      />
      
      <div className="min-h-screen bg-sand overflow-auto">
        <div className="w-full flex flex-col items-center px-4 py-8 max-w-none">
          {/* Loading State */}
          {isLoadingExistingData && (
            <div className="text-center mb-12 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-gold mb-4"></div>
              <p className="text-lg text-gray-700">Loading your existing resume data...</p>
            </div>
          )}

          {!isLoadingExistingData && (
            <>
              {/* Header Section */}
              <div className="text-center mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold text-carbon mb-4">
                  {isEditMode ? 'Edit Resume' : 'Resume Form'}
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl">
                  {isEditMode 
                    ? 'Update your professional information, skills, experience, and projects.'
                    : 'Create your professional resume by filling out the information below.'
                  }
                </p>
                {isEditMode && (
                  <p className="text-sm text-rich-gold mt-2">
                    You are editing your existing resume as {user?.name}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-8">
            
            {/* Profile Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                          <h2 className="text-2xl font-semibold text-carbon mb-6 flex items-center arabic-text-semibold" dir="rtl">
                            <User className="w-6 h-6 ml-2 text-rich-gold" />
                            معلومات الملف الشخصي
                          </h2>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                                الاسم الكامل *
                              </label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all arabic-text"
                                placeholder="اسمك الكامل"
                                dir="rtl"
                              />
                            </div>

                            <div>
                              <label htmlFor="professional_title" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                                المسمى الوظيفي *
                              </label>
                              <input
                                type="text"
                                id="professional_title"
                                name="professional_title"
                                value={formData.professional_title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all arabic-text"
                                placeholder="المسمى الوظيفي"
                                dir="rtl"
                              />
                            </div>


                            {MailInputComponent(formData, setFormData)}

                            <PhoneInputComponent formData={formData} setFormData={setFormData} />

                            <div>
                              <label htmlFor="city" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                                المدينة (داخل تركيا) *
                              </label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <select
                                  id="city"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all arabic-text"
                                  dir="rtl"
                                >
                                  <option value="" disabled>اختر مدينة تركية</option>
                                  {turkishCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="relocateToSyria" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                                هل ستنتقل بشكل دائم إلى سوريا هذا الصيف؟ *
                              </label>
                              <select
                                id="relocateToSyria"
                                name="relocateToSyria"
                                value={formData.relocateToSyria}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all arabic-text"
                                dir="rtl"
                              >
                                <option value="" disabled>اختر إجابتك</option>
                                <option value="Yes">نعم</option>
                                <option value="No">لا</option>
                                <option value="Maybe">ربما</option>
                              </select>
                            </div>

                            <div>
                              <label htmlFor="birthdate" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                                تاريخ الميلاد *
                              </label>
                              <input
                                type="date"
                                id="birthdate"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                                dir="rtl"
                              />
                            </div>

                            <div>
                              <label htmlFor="sex" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                                الجنس *
                              </label>
                              <select
                                id="sex"
                                name="sex"
                                value={formData.sex}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all arabic-text"
                                dir="rtl"
                              >
                                <option value="">اختر الجنس</option>
                                <option value="male">ذكر</option>
                                <option value="female">أنثى</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label htmlFor="imageFile" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                                صورة الملف الشخصي
                              </label>
                              
                              {/* Image Preview */}
                              <div className="mb-4 relative inline-block">
                                <img 
                                  src={imagePreview || getMemberImageUrl(formData.image, formData.sex)} 
                                  alt="Profile preview" 
                                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                  onError={(e) => {
                                    // Fallback to default image if the backend image fails to load
                                    e.target.src = getDefaultAvatarPath(formData.sex);
                                  }}
                                />
                                {(imagePreview || formData.image) && (
                                  <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                                    title="Remove image"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                              
                              {/* File Upload */}
                              <div className="relative">
                                <input
                                  type="file"
                                  id="imageFile"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="imageFile"
                                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all cursor-pointer hover:bg-gray-50 flex items-center justify-center space-x-2 arabic-text"
                                  dir="rtl"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  <span className="mr-2">
                                    {formData.imageFile ? 'تغيير الصورة' : 
                                     formData.image ? 'تغيير الصورة' : 
                                     '+ تحميل صورة الملف الشخصي'}
                                  </span>
                                </label>
                              </div>
                              
                              {(formData.imageFile || formData.image) && (
                                <p className="text-sm text-gray-600 mt-2 arabic-text" dir="rtl">
                                  المحدد: {formData.imageFile ? formData.imageFile.name : formData.image || 'صورة من النظام'}
                                </p>
                              )}
                              
                              <p className="text-xs text-gray-500 mt-1 arabic-text" dir="rtl">
                                الصيغ المدعومة: JPG، PNG، GIF. الحجم الأقصى: 5MB
                              </p>
                            </div>
                          </div>
                        </div>

            {/* Academic Section */}
            <AcademicInputComponent formData={formData} setFormData={setFormData} />

            {/* About Me Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-carbon mb-6 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-rich-gold" />
                About Me
              </h2>
              
              <div className="space-y-4">

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-carbon mb-2">
                    Bio *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all resize-none"
                    placeholder="Brief description about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <SkillsInputComponent formData={formData} setFormData={setFormData} />

            {/* Interests Section */}
            <InterestsInputComponent formData={formData} setFormData={setFormData} />

            {/* Social Media Section */}
            <SocialInputComponent formData={formData} setFormData={setFormData} />

            {/* Work Experience Section */}
            <WorkExperienceComponent formData={formData} setFormData={setFormData} />



            {/* Projects Section */}
            <ProjectsComponent formData={formData} setFormData={setFormData} />

            {/* Submit Button */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rich-gold hover:bg-gold-dark disabled:bg-gray-400 text-deep-green font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-deep-green"></div>
                    <span>{isEditMode ? 'Updating Resume...' : 'Saving Resume...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>{isEditMode ? 'Update Resume' : 'Save Resume Data'}</span>
                  </>
                )}
              </button>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mt-4">
                  {submitMessage}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mt-4">
                  {submitMessage}
                </div>
              )}
            </div>

          </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

