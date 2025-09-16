// src/pages/Jobs.jsx (أو حيث كتبت Jobs)
import { useEffect, useMemo, useState } from "react";
import { jobsAPI } from "../utils/api";
import { Link } from "react-router-dom";

const EMP = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  contract: 'عقد',
  internship: 'تدريب',
  temporary: 'مؤقت',
  freelance: 'حر',
  other: 'أخرى',
  'full-time': 'دوام كامل',
  'part-time': 'دوام جزئي',
};

const WORK = {
  onsite: 'حضوري',
  remote: 'عن بعد',
  hybrid: 'هجين',
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        // Try v2 API first, fallback to legacy
        let jobsList;
        try {
          const { jobsV2API } = await import('../utils/v2Api');
          jobsList = await jobsV2API.list({ is_active: true });
        } catch (v2Error) {
          console.log('V2 API failed, using legacy:', v2Error);
          jobsList = await jobsAPI.list({ is_active: true });
        }
        setJobs(Array.isArray(jobsList) ? jobsList : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    
    loadJobs();
  }, []);

  const activeJobs = useMemo(() => jobs.filter(j => j.is_active !== false), [jobs]);

  const applicantsKey = useMemo(
    () => ["applicants_count", "applications_count", "applied_count"]
      .find(k => (jobs[0] || {})[k] !== undefined),
    [jobs]
  );

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <h2 className="text-2xl font-bold mb-4 px-2 sm:px-0" style={{ color: '#D4AF37' }}>الوظائف المتاحة</h2>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الوظائف...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 mx-2 sm:mx-0">
          <p className="text-red-600">خطأ في تحميل الوظائف: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-700 hover:text-red-900 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-0">
            {activeJobs.map(j => {
              const emp = EMP[j.employment_type] || '—';
              const work = WORK[j.workplace_type] || '—';
              const count = (applicantsKey && j[applicantsKey]) ?? 0;

              return (
                <div key={j.id} className="card bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 touch-manipulation">
                  <h3 className="text-lg font-extrabold mb-2 line-clamp-2 leading-snug" style={{ color: '#D4AF37' }}>
                    {j.title}
                  </h3>

                  <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">
                    <span className="block sm:inline">{j.company || '—'}</span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">{j.location || '—'}</span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">{emp}</span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">{work}</span>
                  </p>

                  <div className="text-sm text-gray-700 mb-4 space-y-1 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>المتقدّمون:</span>
                      <span className="font-semibold text-emerald-700">{count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>الحدّ الأقصى:</span>
                      <span className="font-semibold text-gray-800">
                        {j.max_applicants == null || j.max_applicants === 0 ? "غير محدود" : j.max_applicants}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${j.id}`}
                    className="block w-full bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-lg py-3 px-4 text-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 min-h-[44px] flex items-center justify-center touch-manipulation"
                    role="button"
                    aria-label={`عرض تفاصيل وظيفة ${j.title}`}
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              );
            })}
          </div>

          {activeJobs.length === 0 && (
            <div className="text-center text-gray-500 mt-8 px-4">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                </svg>
                <p className="text-lg font-medium text-gray-600 mb-2">لا توجد وظائف متاحة حالياً</p>
                <p className="text-sm text-gray-500">سيظهر عرض الوظائف هنا فور نشرها</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
