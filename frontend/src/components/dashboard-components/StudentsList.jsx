import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const studentsData = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    university: 'Harvard University',
    major: 'Computer Science',
    year: 'Doktora',
    graduationDate: '2024-05-15',
    cvLink: 'https://drive.google.com/file/d/alice-cv',
    avatar: 0
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    university: 'MIT',
    major: 'Mathematics',
    year: 'Lisans',
    graduationDate: '2025-06-10',
    cvLink: 'https://drive.google.com/file/d/bob-cv',
    avatar: 1
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol.williams@example.com',
    university: 'Stanford University',
    major: 'Physics',
    year: 'Graduate',
    graduationDate: '2023-12-15',
    cvLink: 'https://drive.google.com/file/d/carol-cv',
    avatar: 2
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david.brown@example.com',
    university: 'UC Berkeley',
    major: 'Chemistry',
    year: 'Yüksek Lisans',
    graduationDate: '2026-05-20',
    cvLink: 'https://drive.google.com/file/d/david-cv',
    avatar: 3
  },
  {
    id: 5,
    name: 'Eva Davis',
    email: 'eva.davis@example.com',
    university: 'Caltech',
    major: 'Biology',
    year: 'Doktora',
    graduationDate: '2024-06-05',
    cvLink: 'https://drive.google.com/file/d/eva-cv',
    avatar: 4
  },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank.miller@example.com',
    university: 'Yale University',
    major: 'English Literature',
    year: 'Lisans',
    graduationDate: '2025-05-25',
    cvLink: 'https://drive.google.com/file/d/frank-cv',
    avatar: 5
  },
  {
    id: 7,
    name: 'Grace Wilson',
    email: 'grace.wilson@example.com',
    university: 'Princeton University',
    major: 'History',
    year: 'Graduate',
    graduationDate: '2023-05-30',
    cvLink: 'https://drive.google.com/file/d/grace-cv',
    avatar: 6
  },
  {
    id: 8,
    name: 'Henry Moore',
    email: 'henry.moore@example.com',
    university: 'Columbia University',
    major: 'Art History',
    year: 'Ön Lisans',
    graduationDate: '2027-05-15',
    cvLink: 'https://drive.google.com/file/d/henry-cv',
    avatar: 7
  },
  {
    id: 9,
    name: 'Isabella Garcia',
    email: 'isabella.garcia@example.com',
    university: 'University of Chicago',
    major: 'Economics',
    year: 'Lisans',
    graduationDate: '2024-12-15',
    cvLink: 'https://drive.google.com/file/d/isabella-cv',
    avatar: 0
  },
  {
    id: 10,
    name: 'Jack Thompson',
    email: 'jack.thompson@example.com',
    university: 'Northwestern University',
    major: 'Journalism',
    year: 'Yüksek Lisans',
    graduationDate: '2025-08-20',
    cvLink: 'https://drive.google.com/file/d/jack-cv',
    avatar: 1
  },
  {
    id: 11,
    name: 'Katherine Lee',
    email: 'katherine.lee@example.com',
    university: 'University of Pennsylvania',
    major: 'Business Administration',
    year: 'Doktora',
    graduationDate: '2026-03-10',
    cvLink: 'https://drive.google.com/file/d/katherine-cv',
    avatar: 2
  },
  {
    id: 12,
    name: 'Liam Rodriguez',
    email: 'liam.rodriguez@example.com',
    university: 'Duke University',
    major: 'Engineering',
    year: 'Lisans',
    graduationDate: '2024-08-15',
    cvLink: 'https://drive.google.com/file/d/liam-cv',
    avatar: 3
  },
  {
    id: 13,
    name: 'Mia Anderson',
    email: 'mia.anderson@example.com',
    university: 'Georgetown University',
    major: 'International Relations',
    year: 'Graduate',
    graduationDate: '2023-10-20',
    cvLink: 'https://drive.google.com/file/d/mia-cv',
    avatar: 4
  },
  {
    id: 14,
    name: 'Noah Martinez',
    email: 'noah.martinez@example.com',
    university: 'Vanderbilt University',
    major: 'Medicine',
    year: 'Doktora',
    graduationDate: '2027-06-30',
    cvLink: 'https://drive.google.com/file/d/noah-cv',
    avatar: 5
  },
  {
    id: 15,
    name: 'Olivia Taylor',
    email: 'olivia.taylor@example.com',
    university: 'Brown University',
    major: 'Psychology',
    year: 'Yüksek Lisans',
    graduationDate: '2025-12-15',
    cvLink: 'https://drive.google.com/file/d/olivia-cv',
    avatar: 6
  },
  {
    id: 16,
    name: 'Parker Wilson',
    email: 'parker.wilson@example.com',
    university: 'Cornell University',
    major: 'Agriculture',
    year: 'Lisans',
    graduationDate: '2024-09-10',
    cvLink: 'https://drive.google.com/file/d/parker-cv',
    avatar: 7
  },
  {
    id: 17,
    name: 'Quinn Davis',
    email: 'quinn.davis@example.com',
    university: 'Rice University',
    major: 'Architecture',
    year: 'Ön Lisans',
    graduationDate: '2026-07-25',
    cvLink: 'https://drive.google.com/file/d/quinn-cv',
    avatar: 0
  },
  {
    id: 18,
    name: 'Riley Johnson',
    email: 'riley.johnson@example.com',
    university: 'Emory University',
    major: 'Environmental Science',
    year: 'Graduate',
    graduationDate: '2023-11-30',
    cvLink: 'https://drive.google.com/file/d/riley-cv',
    avatar: 1
  },
  {
    id: 19,
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    university: 'Carnegie Mellon University',
    major: 'Computer Engineering',
    year: 'Doktora',
    graduationDate: '2026-04-15',
    cvLink: 'https://drive.google.com/file/d/sophia-cv',
    avatar: 2
  },
  {
    id: 20,
    name: 'Tyler White',
    email: 'tyler.white@example.com',
    university: 'Washington University',
    major: 'Political Science',
    year: 'Lisans',
    graduationDate: '2025-01-20',
    cvLink: 'https://drive.google.com/file/d/tyler-cv',
    avatar: 3
  }
];

function StudentsList({ onSidebarHide }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [graduationYearFilter, setGraduationYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showMore, setShowMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filter options
  const uniqueUniversities = [...new Set(studentsData.map(student => student.university))].sort();
  const uniqueMajors = [...new Set(studentsData.map(student => student.major))].sort();
  const uniqueGraduationYears = [...new Set(studentsData.map(student => 
    new Date(student.graduationDate).getFullYear().toString()
  ))].sort();

  // Filter students based on search term and all filters
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.major.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = yearFilter === '' || student.year === yearFilter;
    const matchesUniversity = universityFilter === '' || student.university === universityFilter;
    const matchesMajor = majorFilter === '' || student.major === majorFilter;
    const matchesGraduationYear = graduationYearFilter === '' || 
                                 new Date(student.graduationDate).getFullYear().toString() === graduationYearFilter;
    
    return matchesSearch && matchesYear && matchesUniversity && matchesMajor && matchesGraduationYear;
  });

  // Sort filtered students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'university':
        aValue = a.university.toLowerCase();
        bValue = b.university.toLowerCase();
        break;
      case 'major':
        aValue = a.major.toLowerCase();
        bValue = b.major.toLowerCase();
        break;
      case 'graduationDate':
        aValue = new Date(a.graduationDate);
        bValue = new Date(b.graduationDate);
        break;
      case 'year':
        const yearOrder = { 'Ön Lisans': 1, 'Lisans': 2, 'Yüksek Lisans': 3, 'Doktora': 4, 'Graduate': 5 };
        aValue = yearOrder[a.year] || 0;
        bValue = yearOrder[b.year] || 0;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Determine how many students to show
  const studentsToShow = showMore ? sortedStudents : sortedStudents.slice(0, 9);
  const hasMoreStudents = sortedStudents.length > 9;

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm('');
    setYearFilter('');
    setUniversityFilter('');
    setMajorFilter('');
    setGraduationYearFilter('');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Count active filters
  const activeFiltersCount = [searchTerm, yearFilter, universityFilter, majorFilter, graduationYearFilter]
    .filter(filter => filter !== '').length;
  return (
    <div className="flex w-full">
      <div className="w-full h-screen hidden sm:block sm:w-20 xl:w-60 flex-shrink-0">
        .
      </div>
      <div className="h-screen flex-grow overflow-x-hidden overflow-auto flex flex-col p-2">
        <div className="w-full sm:flex p-2 items-end">
          <div className="sm:flex-grow flex justify-between">
            <div className="">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-white">Students List</div>
                <div className="flex items-center p-2 bg-card ml-2 rounded-xl">
                  <Icon path="res-react-dash-premium-star" />
                  <div className="ml-2 font-bold text-premium-yellow">
                    {sortedStudents.length} Students
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="flex items-center p-2 bg-blue-600 ml-2 rounded-xl">
                    <Icon path="res-react-dash-search" className="w-4 h-4" />
                    <div className="ml-2 font-bold text-white">
                      {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''} Active
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <Icon
                  path="res-react-dash-date-indicator"
                  className="w-3 h-3"
                />
                <div className="ml-2">Manage all students</div>
              </div>
            </div>
            <IconButton
              icon="res-react-dash-sidebar-open"
              className="block sm:hidden"
              onClick={onSidebarHide}
            />
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <Icon
                path="res-react-dash-search"
                className="w-5 h-5 search-icon left-3 absolute"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-2 pr-2 w-full sm:w-56 rounded-lg border-gray-300 bg-card text-white"
                placeholder="Search students..."
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2",
                showFilters 
                  ? "bg-blue-600 text-white" 
                  : "bg-card text-white border border-gray-600 hover:bg-gray-700"
              )}
            >
              <Icon path="res-react-dash-options" className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 pr-8 bg-card text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="university-asc">University A-Z</option>
                <option value="university-desc">University Z-A</option>
                <option value="major-asc">Major A-Z</option>
                <option value="major-desc">Major Z-A</option>
                <option value="graduationDate-asc">Graduation Date (Earliest)</option>
                <option value="graduationDate-desc">Graduation Date (Latest)</option>
                <option value="year-asc">Academic Level (Low to High)</option>
                <option value="year-desc">Academic Level (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 mb-4">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center space-x-1"
              >
                <Icon path="res-react-dash-close" className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Academic Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Academic Level</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-card text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="Ön Lisans">Ön Lisans</option>
                  <option value="Lisans">Lisans</option>
                  <option value="Yüksek Lisans">Yüksek Lisans</option>
                  <option value="Doktora">Doktora</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              {/* University Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">University</label>
                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-card text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Universities</option>
                  {uniqueUniversities.map(university => (
                    <option key={university} value={university}>{university}</option>
                  ))}
                </select>
              </div>

              {/* Major Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Major</label>
                <select
                  value={majorFilter}
                  onChange={(e) => setMajorFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-card text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Majors</option>
                  {uniqueMajors.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>

              {/* Graduation Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Year</label>
                <select
                  value={graduationYearFilter}
                  onChange={(e) => setGraduationYearFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-card text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {uniqueGraduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-300 mb-2">Active Filters:</div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>Search: "{searchTerm}"</span>
                      <button onClick={() => setSearchTerm('')} className="hover:text-gray-200">×</button>
                    </span>
                  )}
                  {yearFilter && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>Level: {yearFilter}</span>
                      <button onClick={() => setYearFilter('')} className="hover:text-gray-200">×</button>
                    </span>
                  )}
                  {universityFilter && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>University: {universityFilter}</span>
                      <button onClick={() => setUniversityFilter('')} className="hover:text-gray-200">×</button>
                    </span>
                  )}
                  {majorFilter && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>Major: {majorFilter}</span>
                      <button onClick={() => setMajorFilter('')} className="hover:text-gray-200">×</button>
                    </span>
                  )}
                  {graduationYearFilter && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>Grad Year: {graduationYearFilter}</span>
                      <button onClick={() => setGraduationYearFilter('')} className="hover:text-gray-200">×</button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Students Cards Grid */}
        <div className="w-full p-2">
          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-gray-300">
              Showing {studentsToShow.length} of {sortedStudents.length} students
              {sortedStudents.length !== studentsData.length && (
                <span className="text-blue-400"> (filtered from {studentsData.length} total)</span>
              )}
            </div>
            {sortedStudents.length > 0 && (
              <div className="text-sm text-gray-400">
                Sorted by {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
              </div>
            )}
          </div>

          {sortedStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No students found</div>
              <div className="text-gray-500 text-sm mb-4">Try adjusting your search criteria or filters</div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentsToShow.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
              
              {/* View More Button */}
              {hasMoreStudents && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <span>{showMore ? 'Show Less' : `View More (${sortedStudents.length - 9} remaining)`}</span>
                    <svg 
                      className={clsx("w-4 h-4 transition-transform", showMore ? "rotate-180" : "")} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add Student Button */}
        <div className="w-full p-2">
          <div className="rounded-lg bg-card p-6 text-center">
            <div className="flex flex-col items-center">
              <div
                className="mb-4"
                style={{
                  background: '#414455',
                  width: '80px',
                  height: '80px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon path="res-react-dash-add-component" className="w-8 h-8" />
              </div>
              <div className="text-white font-bold mb-2">
                Add New Student
              </div>
              <div className="text-gray-400 mb-4">
                Register a new student to the system
              </div>
              <button
                className="flex items-center p-3"
                style={{
                  background: '#2f49d1',
                  borderRadius: '15px',
                  padding: '8px 16px',
                  justifyContent: 'center',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => navigate("/form")}
              >
                <Icon path="res-react-dash-add-component" className="w-5 h-5" />
                <div className="ml-2">Add Student</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentCard({ student }) {
  const getYearColor = (year) => {
    switch (year) {
      case 'Ön Lisans': return 'bg-blue-100 text-blue-700';
      case 'Yüksek Lisans': return 'bg-green-100 text-green-700';
      case 'Lisans': return 'bg-yellow-100 text-yellow-700';
      case 'Doktora': return 'bg-orange-100 text-orange-700';
      case 'Graduate': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCVClick = (cvLink) => {
    window.open(cvLink, '_blank');
  };

  const handleViewProfile = () => {
    // You can navigate to a detailed student profile page here
    console.log('View profile for:', student.name);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${student.email}`;
  };

  const daysTillGraduation = Math.ceil((new Date(student.graduationDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isGraduated = daysTillGraduation < 0;
  const isGraduatingSoon = daysTillGraduation > 0 && daysTillGraduation <= 90;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-blue-500 group">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden ring-2 ring-gray-700 group-hover:ring-blue-500 transition-all">
            <Image 
              path={`mock_faces_${student.avatar}`} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{student.name}</h2>
            <p className="text-sm text-gray-400 mt-1">{student.major}</p>
            <p className="text-xs text-gray-500">{student.university}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className={clsx("px-3 py-1 rounded-full", getYearColor(student.year))}>
            <span className="text-xs font-medium">{student.year}</span>
          </div>
          {isGraduatingSoon && (
            <div className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded-full">
              <span className="text-xs font-medium">Graduating Soon</span>
            </div>
          )}
          {isGraduated && (
            <div className="px-2 py-1 bg-green-600 text-green-100 rounded-full">
              <span className="text-xs font-medium">Graduated</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        <div className="text-sm text-gray-300 flex items-center space-x-2">
          <Icon path="res-react-dash-search" className="w-4 h-4 text-gray-500" />
          <button 
            onClick={handleEmailClick}
            className="hover:text-blue-400 transition-colors hover:underline"
          >
            {student.email}
          </button>
        </div>
      </div>

      {/* Graduation Date */}
      <div className="text-sm text-gray-300 flex items-center justify-between">
        <div>
          <span className="font-medium">Graduation:</span> {new Date(student.graduationDate).toLocaleDateString()}
        </div>
        {!isGraduated && (
          <div className="text-xs text-gray-400">
            {daysTillGraduation > 0 ? `${daysTillGraduation} days` : 'Overdue'}
          </div>
        )}
      </div>

      {/* University and Major Tags */}
      <div>
        <div className="text-sm font-medium text-gray-300 mb-2">Academic Info:</div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {student.university}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            {student.major}
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Academic Progress</span>
          <span>{isGraduated ? 'Completed' : 'In Progress'}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={clsx(
              "h-2 rounded-full transition-all",
              isGraduated ? "bg-green-500" : isGraduatingSoon ? "bg-yellow-500" : "bg-blue-500"
            )}
            style={{ width: isGraduated ? '100%' : `${Math.max(20, Math.min(90, ((new Date().getFullYear() - 2020) / 8) * 100))}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <button
          onClick={() => handleCVClick(student.cvLink)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
        >
          <Icon path="res-react-dash-options" className="w-4 h-4" />
          <span>View CV</span>
        </button>
        <button 
          onClick={handleViewProfile}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
        >
          <span>Profile</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Icon({ path = 'options', className = 'w-4 h-4' }) {
  return (
    <img
      src={`https://assets.codepen.io/3685267/${path}.svg`}
      alt=""
      className={clsx(className)}
    />
  );
}

function IconButton({
  onClick = () => {},
  icon = 'options',
  className = 'w-4 h-4',
}) {
  return (
    <button onClick={onClick} type="button" className={className}>
      <img
        src={`https://assets.codepen.io/3685267/${icon}.svg`}
        alt=""
        className="w-full h-full"
      />
    </button>
  );
}

function Image({ path = '1', className = 'w-4 h-4' }) {
  return (
    <img
      src={`https://assets.codepen.io/3685267/${path}.jpg`}
      alt=""
      className={clsx(className, 'rounded-full')}
    />
  );
}

export default StudentsList;
