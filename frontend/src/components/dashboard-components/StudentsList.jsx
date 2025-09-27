import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { membersAPI } from '../../utils/api';
import { getMemberImageUrl, getDefaultAvatarPath } from '../../utils/imageUtils';

function StudentsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState([]);
  const [universityFilter, setUniversityFilter] = useState([]);
  const [majorFilter, setMajorFilter] = useState([]);
  const [graduationYearFilter, setGraduationYearFilter] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showMore, setShowMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch members data from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const members = await membersAPI.getAllMembersWithEducation();
        
        // Transform the API data to match the expected format
        const transformedData = members.map(member => ({
          id: member.id,
          name: member.name,
          email: member.email || '',
          university: member.university || 'Unknown University',
          major: member.major || member.professional_title || 'Unknown Major',
          year: member.year || 'Unknown',
          graduationDate: member.graduation_date || new Date().toISOString().split('T')[0],
          cvLink: `/cv/${member.id}`, // CV link to our internal CV page
          imageUrl: member.image, // Actual image URL from backend
          sex: member.sex || 'male',
          bio: member.bio || '',
          skills: member.skills || [],
          interests: member.interests || [],
          phone: member.phone || '',
          country: member.country || '',
          city: member.city || '',
          social_media: member.social_media || {}
        }));
        
        setStudentsData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setError('Failed to load students data. Please try again later.');
        // Fallback to empty array or you could keep the dummy data as fallback
        setStudentsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

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
    
    const matchesYear = yearFilter.length === 0 || yearFilter.includes(student.year);
    const matchesUniversity = universityFilter.length === 0 || universityFilter.includes(student.university);
    const matchesMajor = majorFilter.length === 0 || majorFilter.includes(student.major);
    const matchesGraduationYear = graduationYearFilter.length === 0 || 
                                 graduationYearFilter.includes(new Date(student.graduationDate).getFullYear().toString());
    
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
    setYearFilter([]);
    setUniversityFilter([]);
    setMajorFilter([]);
    setGraduationYearFilter([]);
    setSortBy('name');
    setSortOrder('asc');
  };

  // Count active filters
  const activeFiltersCount = [
    searchTerm, 
    ...yearFilter, 
    ...universityFilter, 
    ...majorFilter, 
    ...graduationYearFilter
  ].filter(filter => filter !== '').length;

  // Helper functions for checkbox filters
  const handleYearFilterChange = (year) => {
    setYearFilter(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleUniversityFilterChange = (university) => {
    setUniversityFilter(prev => 
      prev.includes(university) 
        ? prev.filter(u => u !== university)
        : [...prev, university]
    );
  };

  const handleMajorFilterChange = (major) => {
    setMajorFilter(prev => 
      prev.includes(major) 
        ? prev.filter(m => m !== major)
        : [...prev, major]
    );
  };

  const handleGraduationYearFilterChange = (year) => {
    setGraduationYearFilter(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full h-full flex flex-col p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-screen-2xl mx-auto flex-grow overflow-x-hidden overflow-auto flex flex-col">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-white text-lg">جاري تحميل الطلاب...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-6">
              <div className="text-red-400 text-lg mb-2">خطأ في تحميل البيانات</div>
              <div className="text-red-300 text-sm mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            <div className="w-full sm:flex p-2 items-end">
          <div className="sm:flex-grow flex justify-between">
            <div className="">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-carbon">قائمة الطلاب</div>
                <div className="flex items-center p-2 bg-card ml-2 rounded-xl">
                  <Icon path="res-react-dash-premium-star" />
                  <div className="ml-2 font-bold text-rich-gold">
                    {sortedStudents.length} طالب
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="flex items-center p-2 bg-rich-gold ml-2 rounded-xl">
                    <Icon path="res-react-dash-search" className="w-4 h-4" />
                    <div className="ml-2 font-bold text-deep-green">
                      {activeFiltersCount} مرشح نشط
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <Icon
                path="res-react-dash-search"
                className="w-5 h-5 search-icon right-3 absolute text-deep-green"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="brand-form-input pl-12 py-2 pr-2 w-full sm:w-56 rounded-lg border-2 border-gray-300 bg-white text-carbon focus:border-rich-gold"
                placeholder="البحث عن الطلاب..."
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2",
                showFilters 
                  ? "bg-rich-gold text-deep-green" 
                  : "bg-white text-carbon border-2 border-gray-300 hover:border-rich-gold"
              )}
            >
              <Icon path="res-react-dash-options" className="w-4 h-4" />
              <span>الفلاتر</span>
              {activeFiltersCount > 0 && (
                <span className="bg-deep-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                className="brand-form-input px-4 py-2 pr-8 bg-white text-carbon rounded-lg border-2 border-gray-300 focus:border-rich-gold"
              >
                <option value="name-asc">الاسم أ-ي</option>
                <option value="name-desc">الاسم ي-أ</option>
                <option value="university-asc">الجامعة أ-ي</option>
                <option value="university-desc">الجامعة ي-أ</option>
                <option value="major-asc">التخصص أ-ي</option>
                <option value="major-desc">التخصص ي-أ</option>
                <option value="graduationDate-asc">تاريخ التخرج (الأقرب)</option>
                <option value="graduationDate-desc">تاريخ التخرج (الأحدث)</option>
                <option value="year-asc">المستوى الأكاديمي (من الأدنى للأعلى)</option>
                <option value="year-desc">المستوى الأكاديمي (من الأعلى للأدنى)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="w-full p-4 bg-white rounded-lg border border-gray-200 mb-4 shadow-md">
            <div className="flex flex-wrap items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-carbon">الفلاتر المتقدمة</h3>
              <button
                onClick={clearAllFilters}
                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center space-x-1"
              >
                <Icon path="res-react-dash-close" className="w-4 h-4" />
                <span>مسح الكل</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Academic Level Filter */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">المستوى الأكاديمي</label>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
                  {['Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora', 'Graduate'].map(year => (
                    <label key={year} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={yearFilter.includes(year)}
                        onChange={() => handleYearFilterChange(year)}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-carbon">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* University Filter */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">الجامعة</label>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
                  {uniqueUniversities.map(university => (
                    <label key={university} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={universityFilter.includes(university)}
                        onChange={() => handleUniversityFilterChange(university)}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-carbon">{university}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Major Filter */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">التخصص</label>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
                  {uniqueMajors.map(major => (
                    <label key={major} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={majorFilter.includes(major)}
                        onChange={() => handleMajorFilterChange(major)}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-carbon">{major}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Graduation Year Filter */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">سنة التخرج</label>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
                  {uniqueGraduationYears.map(year => (
                    <label key={year} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={graduationYearFilter.includes(year)}
                        onChange={() => handleGraduationYearFilterChange(year)}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-carbon">{year}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-carbon mb-2">المرشحات النشطة:</div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>بحث: &quot;{searchTerm}&quot;</span>
                      <button onClick={() => setSearchTerm('')} className="hover:text-gray-200">×</button>
                    </span>
                  )}
                  {yearFilter.map(year => (
                    <span key={year} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>مستوى: {year}</span>
                      <button onClick={() => handleYearFilterChange(year)} className="hover:text-gray-200">×</button>
                    </span>
                  ))}
                  {universityFilter.map(university => (
                    <span key={university} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>جامعة: {university}</span>
                      <button onClick={() => handleUniversityFilterChange(university)} className="hover:text-gray-200">×</button>
                    </span>
                  ))}
                  {majorFilter.map(major => (
                    <span key={major} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>تخصص: {major}</span>
                      <button onClick={() => handleMajorFilterChange(major)} className="hover:text-gray-200">×</button>
                    </span>
                  ))}
                  {graduationYearFilter.map(year => (
                    <span key={year} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>سنة التخرج: {year}</span>
                      <button onClick={() => handleGraduationYearFilterChange(year)} className="hover:text-gray-200">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Students Cards Grid */}
        <div className="w-full p-2">
          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-carbon">
              عرض {studentsToShow.length} من {sortedStudents.length} طالب
              {sortedStudents.length !== studentsData.length && (
                <span className="text-rich-gold"> (مفلتر من {studentsData.length} إجمالي)</span>
              )}
            </div>
            {sortedStudents.length > 0 && (
              <div className="text-sm text-deep-green">
                مرتب حسب {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()} ({sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'})
              </div>
            )}
          </div>

          {sortedStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">لم يتم العثور على طلاب</div>
              <div className="text-gray-500 text-sm mb-4">حاول تعديل معايير البحث أو المرشحات</div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  مسح جميع المرشحات
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-fr">
                {studentsToShow.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
              
              {/* View More Button */}
              {hasMoreStudents && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="brand-btn-primary bg-rich-gold hover:bg-gold-dark text-deep-green px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <span>{showMore ? 'عرض أقل' : `عرض المزيد (${sortedStudents.length - 9} متبقي)`}</span>
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
          <div className="brand-card rounded-lg bg-white p-6 text-center border-2 border-dashed border-rich-gold">
            <div className="flex flex-col items-center">
              <div
                className="mb-4 bg-sand flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '999px',
                }}
              >
                <Icon path="res-react-dash-add-component" className="w-8 h-8 text-deep-green" />
              </div>
              <div className="text-carbon font-bold mb-2">
                إضافة طالب جديد
              </div>
              <div className="text-gray-600 mb-4">
                تسجيل طالب جديد في النظام
              </div>
              <button
                className="brand-btn-primary bg-rich-gold hover:bg-gold-dark text-deep-green flex items-center p-3 rounded-2xl font-medium transition-colors"
                style={{
                  padding: '12px 24px',
                }}
                onClick={() => navigate("/form")}
              >
                <Icon path="res-react-dash-add-component" className="w-5 h-5" />
                <div className="ml-2">إضافة طالب</div>
              </button>
            </div>
          </div>
          </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

function StudentCard({ student }) {
  const navigate = useNavigate();
  
  const getYearColor = (year) => {
    switch (year) {
      case 'Ön Lisans': return 'bg-sand text-deep-green border border-deep-green';
      case 'Yüksek Lisans': return 'bg-deep-green text-white';
      case 'Lisans': return 'bg-rich-gold text-deep-green';
      case 'Doktora': return 'bg-carbon text-white';
      case 'Graduate': return 'bg-green-light text-white';
      default: return 'bg-gray-100 text-carbon';
    }
  };

  const handleCVClick = (cvLink) => {
    navigate(cvLink);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${student.email}`;
  };

  const daysTillGraduation = Math.ceil((new Date(student.graduationDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isGraduated = daysTillGraduation < 0;
  const isGraduatingSoon = daysTillGraduation > 0 && daysTillGraduation <= 90;

  return (
    <div className="brand-card bg-white rounded-2xl shadow-md hover:shadow-xl p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4 border border-gray-200 hover:border-rich-gold group h-full flex flex-col transition-all duration-300 transform hover:-translate-y-1">
      {/* Header Section */}
      <div className="flex items-start space-x-3 md:space-x-4 flex-shrink-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-rich-gold flex items-center justify-center overflow-hidden ring-2 ring-gray-200 group-hover:ring-rich-gold transition-all flex-shrink-0">
          <img 
            src={getMemberImageUrl(student.imageUrl, student.sex)}
            alt={student.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gender-based avatar if image fails to load
              e.target.src = getDefaultAvatarPath(student.sex);
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-deep-green group-hover:text-rich-gold transition-colors truncate leading-tight">{student.name}</h2>
          <p className="text-sm sm:text-base text-gray-700 mt-1 truncate font-medium">{student.major}</p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{student.university}</p>
        </div>
      </div>

      {/* Content Section - flex-1 to take remaining space */}
      <div className="flex-1 space-y-2 sm:space-y-3">
        {/* Contact Info */}
        <div className="text-xs sm:text-sm text-carbon flex items-center space-x-2">
          <Icon path="res-react-dash-search" className="w-3 h-3 sm:w-4 sm:h-4 text-deep-green flex-shrink-0" />
          <button 
            onClick={handleEmailClick}
            className="hover:text-rich-gold transition-colors hover:underline truncate min-w-0"
          >
            {student.email}
          </button>
        </div>

        {/* Graduation Date */}
        <div className="text-xs sm:text-sm text-carbon">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <span className="font-medium">Graduation:</span> {new Date(student.graduationDate).toLocaleDateString()}
            </div>
            {!isGraduated && (
              <div className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {daysTillGraduation > 0 ? `${daysTillGraduation} days` : 'Overdue'}
              </div>
            )}
          </div>
        </div>

        {/* University and Major Tags */}
        <div>
          <div className="text-xs sm:text-sm font-medium text-carbon mb-2">Academic Info:</div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <span className="px-2 sm:px-3 py-1 bg-sand text-deep-green text-xs font-medium rounded-full border border-deep-green truncate">
              {student.university}
            </span>
            <span className="px-2 sm:px-3 py-1 bg-rich-gold text-deep-green text-xs font-medium rounded-full truncate">
              {student.major}
            </span>
          </div>
        </div>
      </div>

      {/* Status badges - horizontal section */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <div className={clsx("px-2 sm:px-3 py-1 rounded-full flex-shrink-0", getYearColor(student.year))}>
          <span className="text-xs font-medium">{student.year}</span>
        </div>
        {isGraduatingSoon && (
          <div className="px-2 py-1 bg-rich-gold text-deep-green rounded-full flex-shrink-0">
            <span className="text-xs font-medium">قريب التخرج</span>
          </div>
        )}
        {isGraduated && (
          <div className="px-2 py-1 bg-deep-green text-white rounded-full flex-shrink-0">
            <span className="text-xs font-medium">متخرج</span>
          </div>
        )}
      </div>

      {/* Action Buttons - fixed at bottom */}
      <div className="flex items-center justify-center pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={() => handleCVClick(student.cvLink)}
          className="brand-btn-secondary bg-deep-green hover:bg-green-dark text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2 transition-all duration-300 group w-full justify-center"
        >
          <Icon path="res-react-dash-options" className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>عرض السيرة</span>
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
  const getImageSrc = () => {
    if (path === 'default_male_avatar') {
      return '/images/default_male_avatar.jpg';
    }
    if (path === 'default_female_avatar') {
      return '/images/default_female_avatar.jpg';
    }
    // Fallback to original codepen URL for other images
    return `https://assets.codepen.io/3685267/${path}.jpg`;
  };

  return (
    <img
      src={getImageSrc()}
      alt=""
      className={clsx(className, 'rounded-full')}
    />
  );
}

export default StudentsList;
