import { useEffect, useState } from 'react';
import { applicationsAPI, jobsAPI, userAPI, resumeAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import ResumeModal from '@/components/ResumeModal';

const AdminApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]); // Add users state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [filteredApplications, setFilteredApplications] = useState([]);

  // Resume modal state
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch applications, jobs, and users in parallel
        const [applicationsData, jobsData, usersData] = await Promise.all([
          applicationsAPI.getAllApplications(),
          jobsAPI.list(),
          userAPI.getAllUsers()
        ]);
        
        setApplications(applicationsData);
        setJobs(jobsData);
        setUsers(usersData);
        setFilteredApplications(applicationsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('فشل في جلب البيانات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter applications by selected job
    if (selectedJobId) {
      setFilteredApplications(applications.filter(app => app.job_id === selectedJobId));
    } else {
      setFilteredApplications(applications);
    }
  }, [selectedJobId, applications]);

  // Check if user has admin permissions
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  غير مسموح بالوصول
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>ليس لديك صلاحية للوصول إلى صفحة إدارة الطلبات.</p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-red-800 hover:text-red-600"
                  >
                    العودة إلى لوحة التحكم
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : `وظيفة #${jobId}`;
  };

  const getUserName = (userId) => {
    const userData = users.find(u => u.id === userId);
    if (userData && userData.name) {
      return userData.name;
    }
    // Fallback to user ID if name is not found or users are still loading
    return `مستخدم #${userId}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد المراجعة';
      case 'approved':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      default:
        return status || 'غير محدد';
    }
  };

  const handleViewResume = async (userId) => {
    try {
      setResumeLoading(true);
      setResumeError(null);
      setResumeData(null);
      setResumeModalOpen(true);

      const data = await resumeAPI.getResumeByUserId(userId);
      setResumeData(data);
    } catch (err) {
      console.error('Error fetching resume:', err);
      setResumeError(
        err.response?.status === 404 
          ? 'لم يتم العثور على السيرة الذاتية لهذا المستخدم.' 
          : 'فشل في تحميل السيرة الذاتية. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setResumeLoading(false);
    }
  };

  const closeResumeModal = () => {
    setResumeModalOpen(false);
    setResumeData(null);
    setResumeError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">خطأ في التحميل</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                عرض وإدارة جميع طلبات التوظيف في النظام
              </p>
            </div>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 sm:py-2 rounded-lg text-sm font-medium text-center min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-4 h-4 ml-2 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              العودة إلى لوحة التحكم
            </Link>
          </div>
        </div>

        {/* Filters - Mobile Enhanced */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">التصفية</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="jobFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  تصفية حسب الوظيفة
                </label>
                <select
                  id="jobFilter"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="">جميع الوظائف ({applications.length})</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg w-full text-center">
                  عرض <span className="font-semibold text-blue-600">{filteredApplications.length}</span> من أصل <span className="font-semibold">{applications.length}</span> طلب
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List - Mobile Responsive */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">الطلبات</h3>
            
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                <p className="text-sm text-gray-600 px-4">
                  {selectedJobId ? 'لا توجد طلبات لهذه الوظيفة' : 'لم يتم تقديم أي طلبات حتى الآن'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredApplications.map(application => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="space-y-4">
                      {/* Header Info - Mobile Stacked */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="text-base sm:text-lg font-medium text-gray-900">
                            طلب
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </div>
                        </div>
                        
                        {/* Action Buttons - Mobile Friendly */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 rtl:sm:space-x-reverse">
                          {/* View Resume Button */}
                                        <button
                                        onClick={() => window.open(`/cv/${application.user_id}`, '_blank')}
                                        className="inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors min-h-[40px]"
                                        >
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        عرض السيرة الذاتية
                                        </button>

                                        {application.resume_url && (
                                        <a
                                          href={application.resume_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors min-h-[40px]"
                                        >
                                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                          ملف السيرة الذاتية
                                        </a>
                                        )}
                                        
                                        <Link
                                        to={`/jobs/${application.job_id}`}
                                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[40px]"
                                        >
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        عرض الوظيفة
                                        </Link>
                                      </div>
                                      </div>
                                      
                                      {/* Application Details - Mobile Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex justify-between sm:block bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                          <span className="font-medium">مقدم الطلب:</span> 
                          <span className="text-gray-900">
                            {loading ? (
                              <span className="text-gray-500">جاري التحميل...</span>
                            ) : (
                              getUserName(application.user_id)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between sm:block bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                          <span className="font-medium">الوظيفة:</span> 
                          <span className="text-gray-900 text-right sm:text-left">{getJobTitle(application.job_id)}</span>
                        </div>
                        <div className="flex justify-between sm:block bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                          <span className="font-medium">التاريخ:</span> 
                          <span className="text-gray-900">{new Date(application.created_at).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div className="flex justify-between sm:block bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded sm:rounded-none">
                          <span className="font-medium">الوقت:</span> 
                          <span className="text-gray-900">{new Date(application.created_at).toLocaleTimeString('ar-SA')}</span>
                        </div>
                      </div>

                      {/* Cover Letter - Mobile Responsive */}
                      {application.cover_letter && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">خطاب التغطية:</div>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                            {application.cover_letter}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Statistics - Mobile Grid */}
        {applications.length > 0 && (
          <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">قيد المراجعة</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">مقبول</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">مرفوض</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={closeResumeModal}
        resumeData={resumeData}
        loading={resumeLoading}
        error={resumeError}
      />
    </div>
  );
};

export default AdminApplications;
