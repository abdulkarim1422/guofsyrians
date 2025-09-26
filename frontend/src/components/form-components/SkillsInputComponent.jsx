import { useState, useEffect, useRef } from 'react';
import { Code, Plus, Trash2, X } from 'lucide-react';

// Most popular skills from LinkedIn across all industries
const POPULAR_SKILLS = [
  // Programming Languages & Tech
  'JavaScript', 'Python', 'Java', 'TypeScript', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust',
  'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'C', 'Objective-C', 'Dart', 'Perl', 'Shell Scripting',
  
  // Frontend Technologies
  'React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Sass', 'Less', 'Bootstrap', 'Tailwind CSS',
  'jQuery', 'Next.js', 'Nuxt.js', 'Gatsby', 'Svelte', 'Webpack', 'Vite', 'Parcel',
  
  // Backend Technologies
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails',
  'ASP.NET', 'Symfony', 'Gin', 'Echo', 'Koa.js', 'NestJS', 'GraphQL', 'REST API',
  
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'MariaDB',
  'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'Elasticsearch', 'Neo4j',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
  'GitLab', 'Bitbucket', 'CI/CD', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant',
  'Linux', 'Ubuntu', 'CentOS', 'Nginx', 'Apache', 'CloudFlare',
  
  // Mobile Development
  'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin', 'Ionic',
  'Cordova', 'Unity', 'Unreal Engine',
  
  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'Data Science', 'Data Analysis',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
  'Jupyter', 'Power BI', 'Tableau', 'Apache Spark', 'Hadoop', 'ETL', 'Big Data',

  // Soft Skills
  'Leadership', 'Project Management', 'Team Management', 'Communication', 'Problem Solving',
  'Critical Thinking', 'Time Management', 'Collaboration', 'Adaptability', 'Creativity',
  'Public Speaking', 'Negotiation', 'Strategic Planning', 'Decision Making', 'Mentoring',
  
  // Methodologies & Frameworks
  'Agile', 'Scrum', 'Kanban', 'Lean', 'DevOps', 'Test Driven Development', 'Domain Driven Design',
  'Microservices', 'Serverless', 'Event Driven Architecture', 'MVC', 'MVP', 'MVVM',
  
  // Testing
  'Unit Testing', 'Integration Testing', 'End-to-End Testing', 'Jest', 'Mocha', 'Cypress',
  'Selenium', 'Playwright', 'TestNG', 'JUnit', 'PyTest', 'PHPUnit',

  // Business & Management
  'Business Management', 'Strategic Planning', 'Business Development', 'Operations Management',
  'Change Management', 'Process Improvement', 'Business Strategy', 'Organizational Development',
  'Performance Management', 'Stakeholder Management', 'Cross-functional Team Leadership',
  'Budget Management', 'Cost Analysis', 'Risk Management', 'Compliance Management',
  
  // Finance & Accounting
  'Financial Analysis', 'Financial Modeling', 'Financial Planning', 'Budget Planning',
  'Cost Accounting', 'Management Accounting', 'Tax Planning', 'Auditing', 'Investment Analysis',
  'Corporate Finance', 'Treasury Management', 'Risk Assessment', 'Portfolio Management',
  'Forecasting', 'Variance Analysis', 'Cash Flow Management', 'Credit Analysis',
  
  // Sales & Marketing
  'Sales', 'Digital Marketing', 'Social Media Marketing', 'Content Marketing', 'Email Marketing',
  'SEO', 'SEM', 'PPC', 'Marketing Strategy', 'Brand Management', 'Market Research',
  'Lead Generation', 'Customer Acquisition', 'B2B Sales', 'B2C Sales', 'Account Management',
  'CRM', 'Salesforce', 'HubSpot', 'Marketing Automation', 'Growth Hacking', 'Conversion Optimization',
  
  // Healthcare & Medical
  'Medical Research', 'Clinical Research', 'Patient Care', 'Healthcare Management',
  'Medical Writing', 'Pharmacology', 'Epidemiology', 'Biostatistics', 'Clinical Trials',
  'Medical Device Development', 'Healthcare Analytics', 'Public Health', 'Nursing',
  'Physical Therapy', 'Occupational Therapy', 'Medical Coding', 'Healthcare Compliance',
  'Telemedicine', 'Electronic Health Records', 'Medical Imaging',
  
  // Design & UX
  'UI/UX Design', 'User Experience', 'User Interface Design', 'Figma', 'Adobe XD', 'Sketch',
  'Photoshop', 'Illustrator', 'InDesign', 'Wireframing', 'Prototyping', 'Design Thinking',
  'User Research', 'Information Architecture', 'Interaction Design',

  // Education & Training
  'Curriculum Development', 'Instructional Design', 'Educational Technology', 'E-Learning',
  'Training and Development', 'Adult Learning', 'Classroom Management', 'Assessment Design',
  'Educational Research', 'Academic Writing', 'Student Counseling', 'Educational Leadership',
  'Online Teaching', 'Learning Management Systems', 'Educational Psychology',
  
  // Legal & Compliance
  'Legal Research', 'Contract Law', 'Corporate Law', 'Intellectual Property', 'Litigation',
  'Compliance', 'Regulatory Affairs', 'Risk Assessment', 'Legal Writing', 'Due Diligence',
  'Employment Law', 'Immigration Law', 'Real Estate Law', 'Tax Law', 'International Law',
  
  // Engineering & Manufacturing
  'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering',
  'Industrial Engineering', 'Environmental Engineering', 'Aerospace Engineering', 'Biomedical Engineering',
  'Manufacturing', 'Quality Control', 'Lean Manufacturing', 'Six Sigma', 'Process Engineering',
  'Product Development', 'CAD', 'SolidWorks', 'AutoCAD', 'Project Engineering',
  
  // Science & Research
  'Research', 'Scientific Research', 'Laboratory Skills', 'Data Collection', 'Statistical Analysis',
  'Literature Review', 'Grant Writing', 'Research Design', 'Experimental Design', 'Peer Review',
  'Scientific Writing', 'Biology', 'Chemistry', 'Physics', 'Environmental Science', 'Geology',
  'Materials Science', 'Biotechnology', 'Microbiology', 'Genetics', 'Biochemistry',
  
  // Business & Finance
  'Business Analysis', 'Financial Analysis', 'Market Research', 'Sales', 'Marketing',
  'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing',
  'Email Marketing', 'CRM', 'Salesforce', 'HubSpot',

  // Mathematics & Analytics
  'Statistics', 'Statistical Modeling', 'Calculus', 'Linear Algebra', 'Probability Theory',
  'Mathematical Modeling', 'Quantitative Analysis', 'Econometrics', 'Operations Research',
  'Mathematical Optimization', 'Game Theory', 'Time Series Analysis', 'Regression Analysis',
  'A/B Testing', 'Hypothesis Testing', 'Survey Design', 'Sampling Methods',
  
  // Human Resources
  'Human Resources', 'Talent Acquisition', 'Recruiting', 'Employee Relations', 'Performance Management',
  'Compensation and Benefits', 'HR Analytics', 'Organizational Psychology', 'Training and Development',
  'Diversity and Inclusion', 'Employee Engagement', 'HR Information Systems', 'Labor Relations',
  'Succession Planning', 'Workforce Planning', 'Employee Development', 'HR Compliance',
  
  // Media & Communications
  'Content Creation', 'Copywriting', 'Journalism', 'Public Relations', 'Communications Strategy',
  'Media Relations', 'Crisis Communications', 'Brand Communications', 'Technical Writing',
  'Creative Writing', 'Video Production', 'Photography', 'Graphic Design', 'Social Media Management',
  'Podcasting', 'Broadcasting', 'Event Planning', 'Community Management',
  
  // Security
  'Cybersecurity', 'Information Security', 'Network Security', 'Penetration Testing',
  'Ethical Hacking', 'CISSP', 'CEH', 'CompTIA Security+', 'ISO 27001', 'GDPR',

  // Architecture & Construction
  'Architecture', 'Architectural Design', 'Construction Management', 'Project Management',
  'Building Information Modeling', 'Sustainable Design', 'Urban Planning', 'Interior Design',
  'Landscape Architecture', 'Construction Planning', 'Cost Estimation', 'Building Codes',
  'Structural Engineering', 'MEP Engineering', 'Construction Safety', 'Real Estate Development',
  
  // Agriculture & Environment
  'Agriculture', 'Sustainable Agriculture', 'Environmental Science', 'Environmental Consulting',
  'Climate Change', 'Renewable Energy', 'Water Management', 'Soil Science', 'Crop Management',
  'Livestock Management', 'Food Safety', 'Agricultural Research', 'Environmental Policy',
  'Conservation', 'Waste Management', 'Environmental Impact Assessment',
  
  // Arts & Creative
  'Graphic Design', 'Web Design', 'UI/UX Design', 'Visual Design', 'Creative Direction',
  'Art Direction', 'Illustration', 'Animation', 'Video Editing', 'Music Production',
  'Sound Design', 'Creative Writing', 'Art History', 'Fine Arts', 'Digital Art',
  'Typography', 'Branding', 'Package Design', 'Exhibition Design',
  
  // Hospitality & Tourism
  'Hotel Management', 'Restaurant Management', 'Event Management', 'Tourism Management',
  'Customer Service', 'Guest Relations', 'Food and Beverage', 'Revenue Management',
  'Hospitality Marketing', 'Travel Planning', 'Catering', 'Conference Management',
  
  // Transportation & Logistics
  'Supply Chain Management', 'Logistics', 'Transportation Management', 'Warehouse Management',
  'Inventory Management', 'Procurement', 'Vendor Management', 'Distribution', 'Fleet Management',
  'Import/Export', 'Customs Compliance', 'Freight Management', 'Materials Management',
  
  // Architecture & System Design
  'System Architecture', 'Software Architecture', 'System Design', 'Distributed Systems',
  'Load Balancing', 'Caching', 'Message Queues', 'Event Streaming', 'Apache Kafka',
  'RabbitMQ', 'API Design', 'Database Design',

  // Soft Skills & Leadership
  'Leadership', 'Team Leadership', 'Communication', 'Public Speaking', 'Presentation Skills',
  'Negotiation', 'Conflict Resolution', 'Problem Solving', 'Critical Thinking', 'Decision Making',
  'Time Management', 'Project Management', 'Collaboration', 'Teamwork', 'Adaptability',
  'Creativity', 'Innovation', 'Emotional Intelligence', 'Mentoring', 'Coaching',
  'Customer Service', 'Relationship Building', 'Cultural Awareness', 'Multilingual Communication',
  
  // Project Management & Methodologies
  'Project Management', 'PMP', 'Agile', 'Scrum', 'Kanban', 'Lean', 'Six Sigma', 'PRINCE2',
  'Waterfall', 'Risk Management', 'Quality Management', 'Program Management', 'Portfolio Management',
  'Change Management', 'Stakeholder Management', 'Resource Management', 'Schedule Management',
  
  // Digital Tools & Software
  'Microsoft Office', 'Excel', 'PowerPoint', 'Word', 'Microsoft Project', 'Outlook',
  'Google Workspace', 'Slack', 'Microsoft Teams', 'Zoom', 'Trello', 'Asana', 'Monday.com',
  'Notion', 'Salesforce', 'HubSpot', 'SAP', 'Oracle', 'QuickBooks', 'Adobe Creative Suite',
  'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Adobe XD', 'Sketch', 'Canva',
  
  // Version Control & Tools
  'Git', 'SVN', 'Mercurial', 'JIRA', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom',
  'Trello', 'Asana', 'Monday.com', 'Notion', 'VS Code', 'IntelliJ IDEA', 'Eclipse',

  // Quality & Testing
  'Quality Assurance', 'Quality Control', 'Testing', 'Manual Testing', 'Automated Testing',
  'Performance Testing', 'Load Testing', 'Security Testing', 'API Testing', 'Regression Testing',
  'Bug Tracking', 'Test Planning', 'Test Design', 'Test Execution', 'ISO Standards',
  
  // Security & Compliance
  'Cybersecurity', 'Information Security', 'Network Security', 'Data Privacy', 'GDPR',
  'Compliance', 'Risk Assessment', 'Security Auditing', 'Penetration Testing', 'Ethical Hacking',
  'Security Architecture', 'Incident Response', 'Vulnerability Assessment', 'Security Training',
  
  // Language Skills
  'English', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic', 'Portuguese', 'Russian',
  'Italian', 'Japanese', 'Korean', 'Dutch', 'Turkish', 'Hebrew', 'Hindi', 'Translation',
  'Interpretation', 'Technical Translation', 'Localization', 'Cross-cultural Communication',

  // Quality Assurance
  'Quality Assurance', 'Manual Testing', 'Automated Testing', 'Performance Testing',
  'Load Testing', 'Security Testing', 'API Testing', 'Regression Testing', 'Bug Tracking'  
];

export function SkillsInputComponent({ formData, setFormData }) {
  const [currentSkill, setCurrentSkill] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allSkills, setAllSkills] = useState(POPULAR_SKILLS);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch skills from backend when component mounts
  useEffect(() => {
    fetchSkillsFromBackend();
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSkillsFromBackend = async () => {
    try {
      const response = await fetch('/api/members/skills');
      if (response.ok) {
        const backendSkills = await response.json();
        // Combine popular skills with backend skills, removing duplicates
        const combinedSkills = [...new Set([...POPULAR_SKILLS, ...backendSkills])];
        setAllSkills(combinedSkills.sort());
      }
    } catch (error) {
      console.error('Error fetching skills from backend:', error);
      // Continue with popular skills if backend fails
    }
  };

  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  };

  const searchSkills = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }

    const normalizedQuery = normalizeText(query);
    const existingSkills = formData.skills || [];
    
    // Check if the typed skill already exists
    const typedSkillExists = existingSkills.some(existingSkill => 
      normalizeText(existingSkill) === normalizedQuery
    );
    
    // Get matching skills from the list
    const matchingSkills = allSkills
      .filter(skill => {
        const normalizedSkill = normalizeText(skill);
        return normalizedSkill.includes(normalizedQuery) && 
               !existingSkills.some(existingSkill => 
                 normalizeText(existingSkill) === normalizedSkill
               );
      })
      .slice(0, 9); // Limit to 9 results to leave room for typed skill
    
    // Create results array
    let results = [];
    
    // Add the typed skill as first option if it doesn't already exist and doesn't exactly match any existing skill
    if (!typedSkillExists && query.trim()) {
      const exactMatch = matchingSkills.find(skill => 
        normalizeText(skill) === normalizedQuery
      );
      
      if (!exactMatch) {
        results.push({
          skill: query.trim(),
          isCustom: true
        });
      }
    }
    
    // Add matching skills from the list
    results.push(...matchingSkills.map(skill => ({
      skill: skill,
      isCustom: false
    })));

    setSearchResults(results);
    setSelectedIndex(-1); // Reset selection when results change
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentSkill(value);
    searchSkills(value);
    setShowDropdown(value.length > 0);
  };

  const handleInputFocus = () => {
    if (currentSkill.length > 0) {
      searchSkills(currentSkill);
      setShowDropdown(true);
    }
  };

  const addSkill = (skillToAdd = null) => {
    const skill = skillToAdd || currentSkill.trim();
    if (!skill) return;

    const existingSkills = formData.skills || [];
    
    // Check if skill already exists (case-insensitive)
    const skillExists = existingSkills.some(existingSkill => 
      normalizeText(existingSkill) === normalizeText(skill)
    );

    if (!skillExists) {
      setFormData(prev => ({
        ...prev,
        skills: [...existingSkills, skill]
      }));
    }

    setCurrentSkill('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
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
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        // Add the selected search result
        addSkill(searchResults[selectedIndex].skill);
      } else if (searchResults.length > 0) {
        // Add the first search result
        addSkill(searchResults[0].skill);
      } else {
        // Add the typed skill
        addSkill();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setCurrentSkill('');
      setSearchResults([]);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex(prev => (prev + 1) % searchResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex(prev => prev <= 0 ? searchResults.length - 1 : prev - 1);
      }
    }
  };

  const handleDropdownItemClick = (skill) => {
    addSkill(skill);
  };

  const clearSearch = () => {
    setCurrentSkill('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-carbon mb-6 flex items-center">
        <Code className="w-6 h-6 mr-2 text-rich-gold" />
        Skills
      </h2>
      
      <div className="space-y-6">
        {/* Skills Input with Search */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentSkill}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleSkillKeyPress}
                  className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all text-xs sm:text-base"
                  placeholder="Search or type a skill (e.g., JavaScript, Project Management, etc.)"
                />
                {currentSkill && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Search Dropdown */}
              {showDropdown && (searchResults.length > 0 || currentSkill.trim()) && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto transition-shadow duration-200 hover:shadow-xl"
                >
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDropdownItemClick(result.skill)}
                      className={`dropdown-item w-full text-left px-4 py-3 text-carbon transition-all duration-200 border-b border-gray-100 last:border-b-0 focus:bg-gray-100 focus:outline-none cursor-pointer ${
                        index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="transition-colors duration-200">{result.skill}</span>
                          {result.isCustom && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full transition-all duration-200">
                              Custom
                            </span>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-gray-400 transition-colors duration-200 group-hover:text-gray-600" />
                      </div>
                    </button>
                  ))}
                  
                  {/* Show "No suggestions found" message when there are no results but user is typing */}
                  {searchResults.length === 0 && currentSkill.trim() && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span>لا توجد اقتراحات. اضغط Enter أو انقر على &quot;إضافة مهارة&quot; للإضافة</span>
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => addSkill()}
                          className="text-deep-green hover:text-green-dark font-medium cursor-pointer transition-colors duration-200 hover:bg-green-50 px-2 py-1 rounded"
                        >
                          إضافة &quot;{currentSkill.trim()}&quot;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => addSkill()}
              disabled={!currentSkill.trim()}
              className="bg-deep-green hover:bg-green-dark disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all duration-200 whitespace-nowrap hover:shadow-md"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Add Skill</span>
            </button>
          </div>
          
          {/* Helper text */}
          <p className="text-xs text-gray-600 mt-2">
            Start typing to search from popular skills or add your own custom skill. Use ↑↓ arrows to navigate, Enter to add, Esc to close.
          </p>
        </div>
        
        {/* Skills Display */}
        {formData.skills && formData.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-carbon">Your Skills:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-sand border border-gray-200 rounded-lg px-4 py-3 min-h-[3rem] flex items-center justify-center group hover:bg-gray-100 transition-colors relative"
                >
                  <span className="text-carbon text-sm text-center flex-1 pr-6">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    title="إزالة المهارة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {(!formData.skills || formData.skills.length === 0) && (
          <div className="text-center py-6 text-gray-600">
            <Code className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">لا توجد مهارات مضافة بعد. ابحث أو اكتب مهارة أعلاه واضغط &quot;إضافة مهارة&quot;.</p>
            <p className="text-xs text-gray-500 mt-2">
              ستظهر الاقتراحات الشائعة أثناء الكتابة
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
