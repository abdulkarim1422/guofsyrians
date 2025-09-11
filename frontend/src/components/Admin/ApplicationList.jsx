import { useEffect, useState } from "react";
import { applicationsAPI } from "../../utils/api";

export default function ApplicationList({ jobId }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const applications = jobId 
          ? await applicationsAPI.getApplicationsForJob(jobId)
          : await applicationsAPI.getAllApplications();
        setApps(applications);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('فشل في جلب الطلبات');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center text-gray-600 mt-2">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {jobId ? 'متقدمو هذه الوظيفة' : 'جميع الطلبات'}
        </h3>
        <div className="text-sm text-gray-500">
          {apps.length} طلب
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          لا توجد طلبات حتى الآن
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map(app => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="text-sm font-medium text-gray-900">
                      مستخدم #{app.user_id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(app.created_at).toLocaleDateString('ar-SA')} - {new Date(app.created_at).toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                  
                  {app.job_id && (
                    <div className="text-xs text-gray-600 mt-1">
                      وظيفة #{app.job_id}
                    </div>
                  )}
                  
                  {app.cover_letter && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">خطاب التغطية:</div>
                      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border-r-2 border-blue-200">
                        {app.cover_letter}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status === 'pending' ? 'قيد المراجعة' :
                     app.status === 'approved' ? 'مقبول' :
                     app.status === 'rejected' ? 'مرفوض' :
                     app.status || 'غير محدد'}
                  </span>
                  
                  {app.resume_url && (
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      عرض السيرة الذاتية
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
