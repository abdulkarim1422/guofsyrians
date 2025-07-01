import { useState, useEffect, useRef } from 'react';
import { Code, Plus, Trash2, Search, X } from 'lucide-react';

// Most popular skills from LinkedIn and tech industry
const POPULAR_SKILLS = [
  // Programming Languages
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
  
  // Design & UX
  'UI/UX Design', 'User Experience', 'User Interface Design', 'Figma', 'Adobe XD', 'Sketch',
  'Photoshop', 'Illustrator', 'InDesign', 'Wireframing', 'Prototyping', 'Design Thinking',
  'User Research', 'Information Architecture', 'Interaction Design',
  
  // Business & Finance
  'Business Analysis', 'Financial Analysis', 'Market Research', 'Sales', 'Marketing',
  'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing',
  'Email Marketing', 'CRM', 'Salesforce', 'HubSpot',
  
  // Security
  'Cybersecurity', 'Information Security', 'Network Security', 'Penetration Testing',
  'Ethical Hacking', 'CISSP', 'CEH', 'CompTIA Security+', 'ISO 27001', 'GDPR',
  
  // Architecture & System Design
  'System Architecture', 'Software Architecture', 'System Design', 'Distributed Systems',
  'Load Balancing', 'Caching', 'Message Queues', 'Event Streaming', 'Apache Kafka',
  'RabbitMQ', 'API Design', 'Database Design',
  
  // Version Control & Tools
  'Git', 'SVN', 'Mercurial', 'JIRA', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom',
  'Trello', 'Asana', 'Monday.com', 'Notion', 'VS Code', 'IntelliJ IDEA', 'Eclipse',
  
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
    
    const results = allSkills
      .filter(skill => {
        const normalizedSkill = normalizeText(skill);
        return normalizedSkill.includes(normalizedQuery) && 
               !existingSkills.some(existingSkill => 
                 normalizeText(existingSkill) === normalizedSkill
               );
      })
      .slice(0, 10); // Limit to 10 results

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
        addSkill(searchResults[selectedIndex]);
      } else if (searchResults.length > 0) {
        // Add the first search result
        addSkill(searchResults[0]);
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={currentSkill}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleSkillKeyPress}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                  placeholder="Search or type a skill (e.g., JavaScript, Project Management, etc.)"
                />
                {currentSkill && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Search Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {searchResults.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDropdownItemClick(skill)}
                      className={`dropdown-item w-full text-left px-4 py-3 text-carbon transition-colors border-b border-gray-100 last:border-b-0 focus:bg-sand focus:outline-none ${
                        index === selectedIndex ? 'bg-sand' : 'hover:bg-sand'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{skill}</span>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => addSkill()}
              disabled={!currentSkill.trim()}
              className="bg-deep-green hover:bg-green-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>
          
          {/* Helper text */}
          <p className="text-xs text-gray-600 mt-2">
            Start typing to search from popular skills or add your own. Use ↑↓ arrows to navigate, Enter to add, Esc to close.
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
                    title="Remove skill"
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
            <p className="text-sm">No skills added yet. Search or type a skill above and click "Add Skill".</p>
            <p className="text-xs text-gray-500 mt-2">
              Popular suggestions will appear as you type
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
