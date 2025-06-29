import { useState } from 'react';
import { Phone, MapPin, Send, User, MessageSquare, Briefcase, GraduationCap, Code, Award, Globe, Plus, Trash2 } from 'lucide-react';
import { SEO } from '../components_renamed/SEO';
import { MailInputComponent } from '../components_renamed/form-components/MailInputComponent';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    // Profile data
    name: '',
    occupation: '',
    location: '',
    email: '',
    telephone: '',
    image: '',
    imageFile: null,
    relocateToSyria: '',
    
    // About Me
    aboutLabel: '',
    aboutDescription: '',
    
    // Skills
    skills: [],
    
    // Social Media
    socialLabel: '',
    socialAccounts: [
      {
        platform: '',
        url: ''
      }
    ],
    
    // Work Experience
    works: [
      {
        title: '',
        period: '',
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
        company: '',
        period: '',
        description: ['']
      }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      image: ''
    }));
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('imageFile');
    if (fileInput) fileInput.value = '';
  };

  const handleWorkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === index ? { ...work, [field]: value } : work
      )
    }));
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
        period: '',
        company: '',
        description: ['']
      }]
    }));
  };

  const removeWorkEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index)
    }));
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

  const handleAcademicChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      academic: prev.academic.map((edu, i) => 
        i === index ? { 
          ...edu, 
          [field]: value,
          // Clear major when degree level changes
          ...(field === 'degreeLevel' ? { major: '' } : {})
        } : edu
      )
    }));
  };

  const getAvailableMajors = (degreeLevel) => {
    const majorsByDegree = {
      "Bachelor's": {
        "Engineering": [
          "Civil Engineering",
          "Electrical Engineering", 
          "Software Engineering",
          "Mechanical Engineering",
          "Chemical Engineering",
          "Computer Engineering",
          "Aerospace Engineering",
          "Environmental Engineering"
        ],
        "Medicine & Health": [
          "Pre-Medicine",
          "Nursing",
          "Public Health",
          "Biomedical Sciences",
          "Physical Therapy",
          "Occupational Therapy",
          "Medical Technology"
        ],
        "Business & Management": [
          "Business Administration",
          "Finance",
          "Marketing",
          "Human Resources",
          "International Business",
          "Accounting",
          "Economics",
          "Management Information Systems"
        ],
        "Humanities & Social Sciences": [
          "Psychology",
          "Sociology",
          "Literature",
          "History",
          "Political Science",
          "Philosophy",
          "Anthropology",
          "Communications"
        ],
        "Sciences": [
          "Computer Science",
          "Biology",
          "Chemistry",
          "Physics",
          "Mathematics",
          "Environmental Science",
          "Statistics",
          "Data Science"
        ],
        "Arts & Design": [
          "Fine Arts",
          "Graphic Design",
          "Architecture",
          "Music",
          "Theater Arts",
          "Digital Media",
          "Industrial Design"
        ]
      },
      "Master's": {
        "Engineering": [
          "Master of Engineering (MEng)",
          "Master of Science in Engineering",
          "Software Engineering",
          "Data Engineering",
          "Systems Engineering",
          "Engineering Management"
        ],
        "Medicine & Health": [
          "Master of Public Health (MPH)",
          "Master of Health Administration",
          "Master of Nursing",
          "Master of Biomedical Sciences",
          "Master of Health Informatics"
        ],
        "Business & Management": [
          "Master of Business Administration (MBA)",
          "Master of Finance",
          "Master of Marketing",
          "Master of Project Management",
          "Master of International Business",
          "Master of Data Analytics"
        ],
        "Humanities & Social Sciences": [
          "Master of Psychology",
          "Master of Social Work",
          "Master of Education",
          "Master of Public Administration",
          "Master of International Relations"
        ],
        "Sciences": [
          "Master of Science (MS)",
          "Master of Computer Science",
          "Master of Data Science",
          "Master of Applied Mathematics",
          "Master of Statistics"
        ],
        "Arts & Design": [
          "Master of Fine Arts (MFA)",
          "Master of Architecture",
          "Master of Design",
          "Master of Digital Media"
        ]
      },
      "PhD/Doctorate": {
        "Engineering": [
          "Doctor of Philosophy in Engineering",
          "Doctor of Engineering",
          "PhD in Computer Science",
          "PhD in Electrical Engineering"
        ],
        "Medicine & Health": [
          "Doctor of Medicine (MD)",
          "Doctor of Dental Medicine (DMD)",
          "Doctor of Pharmacy (PharmD)",
          "Doctor of Veterinary Medicine (DVM)",
          "PhD in Biomedical Sciences"
        ],
        "Business & Management": [
          "Doctor of Business Administration (DBA)",
          "PhD in Business Administration",
          "PhD in Economics",
          "PhD in Management"
        ],
        "Humanities & Social Sciences": [
          "PhD in Psychology",
          "PhD in Sociology", 
          "PhD in Political Science",
          "PhD in Education",
          "PhD in Philosophy"
        ],
        "Sciences": [
          "PhD in Computer Science",
          "PhD in Mathematics",
          "PhD in Physics",
          "PhD in Chemistry",
          "PhD in Biology"
        ]
      },
      "Associate": {
        "Applied Sciences": [
          "Associate of Applied Science (AAS)",
          "Computer Information Systems",
          "Web Development",
          "Network Administration"
        ],
        "Business": [
          "Business Administration",
          "Accounting",
          "Marketing",
          "Office Administration"
        ],
        "Health Sciences": [
          "Medical Assistant",
          "Dental Hygiene",
          "Radiologic Technology",
          "Nursing (RN)"
        ],
        "Technical": [
          "Electronics Technology",
          "Automotive Technology",
          "Construction Management",
          "Culinary Arts"
        ]
      },
      "Certificate/Diploma": {
        "Technology": [
          "Web Development Certificate",
          "Cybersecurity Certificate",
          "Data Analytics Certificate",
          "Digital Marketing Certificate"
        ],
        "Professional": [
          "Project Management Certificate",
          "Human Resources Certificate",
          "Financial Planning Certificate",
          "Teaching Certificate"
        ],
        "Technical Skills": [
          "Microsoft Certification",
          "AWS Certification",
          "Google Analytics Certificate",
          "Adobe Certified Expert"
        ],
        "Healthcare": [
          "Medical Coding Certificate",
          "Pharmacy Technician Certificate",
          "Medical Assistant Certificate"
        ]
      }
    };

    return majorsByDegree[degreeLevel] || {};
  };

  const addAcademicEntry = () => {
    setFormData(prev => ({
      ...prev,
      academic: [...prev.academic, {
        degreeLevel: '',
        major: '',
        date: '',
        institution: ''
      }]
    }));
  };

  const removeAcademicEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      academic: prev.academic.filter((_, i) => i !== index)
    }));
  };

  const [currentSkill, setCurrentSkill] = useState('');

  const addSkill = () => {
    if (currentSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSocialAccountChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.map((account, i) => 
        i === index ? { ...account, [field]: value } : account
      )
    }));
  };

  const addSocialAccount = () => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: [...prev.socialAccounts, { platform: '', url: '' }]
    }));
  };

  const removeSocialAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.filter((_, i) => i !== index)
    }));
  };

  const getPlatformIcon = (platform) => {
    const iconMap = {
      linkedin: 'bxl-linkedin-square',
      github: 'bxl-github',
      twitter: 'bxl-twitter',
      instagram: 'bxl-instagram',
      facebook: 'bxl-facebook',
      youtube: 'bxl-youtube',
      tiktok: 'bxl-tiktok',
      discord: 'bxl-discord',
      telegram: 'bxl-telegram',
      whatsapp: 'bxl-whatsapp',
      medium: 'bxl-medium',
      behance: 'bxl-behance',
      dribbble: 'bxl-dribbble',
      portfolio: 'bx-globe',
      website: 'bx-world',
      other: 'bx-link'
    };
    return iconMap[platform] || 'bx-link';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission with the complete data structure
    try {
      const updatedData = {
        profile: {
          name: formData.name,
          ocupation: formData.occupation,
          location: formData.location,
          email: formData.email,
          telephone: formData.telephone,
          image: formData.image,
          imageFile: formData.imageFile,
          relocateToSyria: formData.relocateToSyria
        },
        aboutMe: {
          label: formData.aboutLabel,
          description: formData.aboutDescription
        },
        skills: formData.skills,
        socialMedia: {
          label: formData.socialLabel,
          social: formData.socialAccounts.filter(account => account.platform && account.url).map(account => ({
            label: `Visit ${account.platform} profile`,
            name: account.platform,
            url: account.url,
            className: getPlatformIcon(account.platform)
          }))
        },
        experience: {
          works: formData.works,
          academic: formData.academic,
          proyects: formData.projects
        }
      };

      console.log('Updated Data:', updatedData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <>
      <SEO 
        name="Resume Editor - Matias Lagos"
        ocupation="FullStack Software Developer"
        location="Santiago, Chile"
        description="Edit and update resume information including profile, skills, experience, and projects."
      />
      
      <>
        <div className="flex-1 flex flex-col items-center px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Resume Editor
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Update your professional information, skills, experience, and projects. 
              All changes will be saved to the database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-8">
            
            {/* Profile Information */}
                        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
                          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center arabic-text-semibold" dir="rtl">
                            <User className="w-6 h-6 ml-2 text-blue-500" />
                            معلومات الملف الشخصي
                          </h2>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 arabic-text-medium" dir="rtl">
                                الاسم الكامل *
                              </label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all arabic-text"
                                placeholder="اسمك الكامل"
                                dir="rtl"
                              />
                            </div>

                            <div>
                              <label htmlFor="occupation" className="block text-sm font-medium text-gray-300 mb-2 arabic-text-medium" dir="rtl">
                                المسمى الوظيفي *
                              </label>
                              <input
                                type="text"
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all arabic-text"
                                placeholder="المسمى الوظيفي"
                                dir="rtl"
                              />
                            </div>

                            {MailInputComponent(formData, setFormData)}

                            <div>
                              <label htmlFor="telephone" className="block text-sm font-medium text-gray-300 mb-2 arabic-text-medium" dir="rtl">
                                رقم الهاتف *
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                  type="tel"
                                  id="telephone"
                                  name="telephone"
                                  value={formData.telephone}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  placeholder="+90 5xx xxx xx xx"
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2 arabic-text-medium" dir="rtl">
                                المدينة (داخل تركيا) *
                              </label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <select
                                  id="location"
                                  name="location"
                                  value={formData.location}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all arabic-text"
                                  dir="rtl"
                                >
                                  <option value="">اختر مدينة تركية</option>
                                  {turkishCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="relocateToSyria" className="block text-sm font-medium text-gray-300 mb-2 arabic-text-medium" dir="rtl">
                                هل ستنتقل بشكل دائم إلى سوريا هذا الصيف؟ *
                              </label>
                              <select
                                id="relocateToSyria"
                                name="relocateToSyria"
                                value={formData.relocateToSyria}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all arabic-text"
                                dir="rtl"
                              >
                                <option value="">اختر إجابتك</option>
                                <option value="Yes">نعم</option>
                                <option value="No">لا</option>
                                <option value="Maybe">ربما</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-300 mb-2 arabic-text-medium" dir="rtl">
                                صورة الملف الشخصي
                              </label>
                              
                              {/* Image Preview */}
                              {imagePreview && (
                                <div className="mb-4 relative inline-block">
                                  <img 
                                    src={imagePreview} 
                                    alt="Profile preview" 
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                                    title="Remove image"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                              
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
                                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-600 flex items-center justify-center space-x-2 arabic-text"
                                  dir="rtl"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  <span className="mr-2">{formData.imageFile ? 'تغيير الصورة' : '+ تحميل صورة الملف الشخصي'}</span>
                                </label>
                              </div>
                              
                              {formData.imageFile && (
                                <p className="text-sm text-gray-400 mt-2 arabic-text" dir="rtl">
                                  المحدد: {formData.imageFile.name}
                                </p>
                              )}
                              
                              <p className="text-xs text-gray-400 mt-1 arabic-text" dir="rtl">
                                الصيغ المدعومة: JPG، PNG، GIF. الحجم الأقصى: 5MB
                              </p>
                            </div>
                          </div>
                        </div>

            {/* Academic Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white flex items-center">
                        <GraduationCap className="w-6 h-6 mr-2 text-red-500" />
                        Academic Background
                    </h2>
                </div>
                
                {formData.academic.map((edu, index) => (
                    <div key={index} className="border border-gray-600 rounded-lg p-6 mb-6 bg-gray-750 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Education {index + 1}</h3>
                            {formData.academic.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeAcademicEntry(index)}
                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                    title="Remove this education entry"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Degree Level *
                                </label>
                                <select
                                    value={edu.degreeLevel}
                                    onChange={(e) => handleAcademicChange(index, 'degreeLevel', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Select degree level</option>
                                    <option value="Bachelor's">Bachelor&apos;s Degree</option>
                                    <option value="Master's">Master&apos;s Degree</option>
                                    <option value="PhD/Doctorate">PhD/Doctorate</option>
                                    <option value="Associate">Associate Degree</option>
                                    <option value="Certificate/Diploma">Certificate/Diploma</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    Select your degree level to see available fields of study
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Field of Study *
                                </label>
                                <select
                                    value={edu.major}
                                    onChange={(e) => handleAcademicChange(index, 'major', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                    disabled={!edu.degreeLevel}
                                >
                                    <option value="">
                                        {edu.degreeLevel ? "Select field of study" : "First select degree level"}
                                    </option>
                                    {edu.degreeLevel && Object.entries(getAvailableMajors(edu.degreeLevel)).map(([category, majors]) => (
                                        <optgroup key={category} label={`${category} (${majors.length} options)`}>
                                            {majors.map(major => (
                                                <option key={major} value={major}>{major}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                    {edu.degreeLevel && (
                                        <optgroup label="Other">
                                            <option value="Other">Other (Please specify in institution field)</option>
                                        </optgroup>
                                    )}
                                </select>
                                {edu.degreeLevel && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Categories available for {edu.degreeLevel} level. Select &quot;Other&quot; if your field is not listed.
                                    </p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Graduation Date *
                                </label>
                                <input
                                    type="text"
                                    value={edu.date}
                                    onChange={(e) => handleAcademicChange(index, 'date', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="2019 or May 2019"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Institution *
                                </label>
                                <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => handleAcademicChange(index, 'institution', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="University name"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}
                
                {formData.academic.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No education entries yet. Click &quot;Add Education&quot; to get started.</p>
                    </div>
                )}
                
                {/* Add Education Button */}
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={addAcademicEntry}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Education</span>
                    </button>
                </div>
            </div>

            {/* About Me Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-green-500" />
                About Me
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="aboutLabel" className="block text-sm font-medium text-gray-300 mb-2">
                    Section Label
                  </label>
                  <input
                    type="text"
                    id="aboutLabel"
                    name="aboutLabel"
                    value={formData.aboutLabel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Profile / About"
                  />
                </div>

                <div>
                  <label htmlFor="aboutDescription" className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="aboutDescription"
                    name="aboutDescription"
                    value={formData.aboutDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Brief description about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Code className="w-6 h-6 mr-2 text-purple-500" />
                Skills
              </h2>
              
              <div className="space-y-6">
                {/* Add New Skill Input Row */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={handleSkillKeyPress}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter a skill (e.g., JavaScript, Project Management, etc.)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
                
                {/* Skills List */}
                {formData.skills.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white">Your Skills:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 min-h-[3rem] flex items-center justify-center group hover:bg-gray-600 transition-colors relative"
                        >
                          <span className="text-white text-sm text-center flex-1 pr-6">{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Empty State - Only show when no skills exist */}
                {formData.skills.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <Code className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No skills added yet. Enter a skill above and click &quot;Add Skill&quot;.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-orange-500" />
                  Social Media
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* Social Accounts List */}
                {formData.socialAccounts.map((account, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-medium text-white">Social Account {index + 1}</h4>
                      {formData.socialAccounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocialAccount(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Remove this social account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Platform *
                        </label>
                        <select
                          value={account.platform}
                          onChange={(e) => handleSocialAccountChange(index, 'platform', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select platform</option>
                          <option value="linkedin">📈 LinkedIn</option>
                          <option value="github">🐙 GitHub</option>
                          <option value="twitter">🐦 Twitter</option>
                          <option value="instagram">📷 Instagram</option>
                          <option value="facebook">📘 Facebook</option>
                          <option value="youtube">📺 YouTube</option>
                          <option value="tiktok">🎵 TikTok</option>
                          <option value="discord">💬 Discord</option>
                          <option value="telegram">✈️ Telegram</option>
                          <option value="whatsapp">📱 WhatsApp</option>
                          <option value="medium">📝 Medium</option>
                          <option value="behance">🎨 Behance</option>
                          <option value="dribbble">🏀 Dribbble</option>
                          <option value="portfolio">🌐 Portfolio</option>
                          <option value="website">💻 Website</option>
                          <option value="other">🔗 Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Profile URL *
                        </label>
                        <input
                          type="url"
                          value={account.url}
                          onChange={(e) => handleSocialAccountChange(index, 'url', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="https://platform.com/username"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.socialAccounts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No social accounts added yet. Click &quot;Add Account&quot; to get started.</p>
                  </div>
                )}
                
                {/* Add Account Button */}
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={addSocialAccount}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-indigo-500" />
                  Work Experience
                </h2>
              </div>
              
              {formData.works.map((work, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-6 mb-6 bg-gray-750">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Position {index + 1}</h3>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={work.title}
                        onChange={(e) => handleWorkChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Full-Stack Developer, Software Engineer, Data Scientist, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Period *
                      </label>
                      <input
                        type="text"
                        value={work.period}
                        onChange={(e) => handleWorkChange(index, 'period', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Oct. 2021 - Present, Jan 2020 - Dec 2021"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={work.company}
                        onChange={(e) => handleWorkChange(index, 'company', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Company Name, Organization, etc."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Job Description *
                      </label>
                      <button
                        type="button"
                        onClick={() => addWorkDescription(index)}
                        className="text-green-400 hover:text-green-300 text-sm flex items-center space-x-1 transition-colors"
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
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder={`• Key responsibility or achievement ${descIndex + 1}`}
                          required={descIndex === 0}
                        />
                        {work.description.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWorkDescription(index, descIndex)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Remove this description"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-1">
                      Add multiple bullet points to highlight key achievements and responsibilities
                    </p>
                  </div>
                </div>
              ))}
              
              {formData.works.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No work experience entries yet. Click &quot;Add Position&quot; to get started.</p>
                </div>
              )}
              
              {/* Add Position Button */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={addWorkEntry}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Position</span>
                </button>
              </div>
            </div>



            {/* Projects Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-500" />
                  Projects
                </h2>
              </div>
              
              {formData.projects.map((project, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-6 mb-6 bg-gray-750">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="E-commerce Platform, Mobile App, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company/Client
                      </label>
                      <input
                        type="text"
                        value={project.company}
                        onChange={(e) => handleProjectChange(index, 'company', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Client Name, Personal Project, etc."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Period *
                      </label>
                      <input
                        type="text"
                        value={project.period}
                        onChange={(e) => handleProjectChange(index, 'period', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nov. 2019 - Jan. 2020, 6 months, etc."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Project Description *
                      </label>
                      <button
                        type="button"
                        onClick={() => addProjectDescription(index)}
                        className="text-green-400 hover:text-green-300 text-sm flex items-center space-x-1 transition-colors"
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
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder={`• Project feature or achievement ${descIndex + 1}`}
                          required={descIndex === 0}
                        />
                        {project.description.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProjectDescription(index, descIndex)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Remove this description"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-1">
                      Highlight key features, technologies used, and project outcomes
                    </p>
                  </div>
                </div>
              ))}
              
              {formData.projects.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No project entries yet. Click &quot;Add Project&quot; to get started.</p>
                </div>
              )}
              
              {/* Add Project Button */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={addProjectEntry}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Save Resume Data</span>
                  </>
                )}
              </button>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-800 border border-green-600 text-green-200 px-4 py-3 rounded-lg mt-4">
                  Resume data saved successfully! All changes have been updated.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded-lg mt-4">
                  There was an error saving the data. Please try again.
                </div>
              )}
            </div>

          </form>
        </div>
      </>
    </>
  );
};

