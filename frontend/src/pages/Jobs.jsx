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
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#D4AF37' }}>الوظائف المتاحة</h2>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الوظائف...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">خطأ في تحميل الوظائف: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-700 hover:text-red-900 underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeJobs.map(j => {
              const emp = EMP[j.employment_type] || '—';
              const work = WORK[j.workplace_type] || '—';
              const count = (applicantsKey && j[applicantsKey]) ?? 0;

              return (
                <div key={j.id} className="card bg-white border rounded-2xl p-4 shadow-sm">
                  <h3 className="text-lg font-extrabold mb-1" style={{ color: '#D4AF37' }}>
                    {j.title}
                  </h3>

                  <p className="text-gray-700">
                    {j.company || '—'} • {j.location || '—'} • {emp} • {work}
                  </p>

                  <div className="text-sm text-gray-700 mt-3 space-y-1">
                    <div>المتقدّمون: <b>{count}</b></div>
                    <div>الحدّ: <b>{j.max_applicants == null || j.max_applicants === 0 ? "غير محدود" : j.max_applicants}</b></div>
                  </div>

                  <Link
                    to={`/jobs/${j.id}`}
                    className="mt-4 w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg py-3 text-center block"
                  >
                    التفاصيل
                  </Link>
                </div>
              );
            })}
          </div>

          {activeJobs.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              لا توجد وظائف حاليًا — سيظهر عرض الوظائف هنا فور نشرها.
            </div>
          )}
        </>
      )}
    </div>
  );
}
