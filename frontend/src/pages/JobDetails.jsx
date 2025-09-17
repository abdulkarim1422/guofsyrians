import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '@/utils/api'; // إضافة applicationsAPI
import { useAuth } from '@/contexts/AuthContext'; // استيراد useAuth للتحقق من المصادقة

export default function JobDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth(); // التحقق من حالة المصادقة
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const labels = useMemo(() => ({
    employment: {
      full_time: 'دوام كامل',
      part_time: 'دوام جزئي',
      contract: 'عقد',
      internship: 'تدريب',
      temporary: 'مؤقت',
      freelance: 'حر',
      other: 'أخرى',
      'full-time': 'دوام كامل',
      'part-time': 'دوام جزئي',
    },
    workplace: { onsite: 'حضوري', remote: 'عن بعد', hybrid: 'هجين' },
  }), []);

  // دالة التقديم على الوظيفة
  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('يرجى تسجيل الدخول أولاً للتقديم على الوظيفة');
      return;
    }

    setApplying(true);
    setApplicationError(null);

    try {
      const applicationData = {
        cover_letter: coverLetter.trim() || null,
        resume_url: resumeUrl.trim() || null
      };

      await applicationsAPI.apply(id, applicationData);
      setApplicationSuccess(true);
      setShowApplicationForm(false);
      setCoverLetter('');
      setResumeUrl('');
    } catch (error) {
      console.error('خطأ في التقديم:', error);
      setApplicationError(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        'حدث خطأ أثناء التقديم على الوظيفة'
      );
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await jobsAPI.get(id);
        if (mounted) setJob(data);
      } catch (e) {
        console.error(e);
        if (mounted) setErr('تعذر جلب تفاصيل الوظيفة.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-4"><div className="bg-card rounded-xl p-6">جاري التحميل...</div></div>;
  if (err || !job) {
    return (
      <div className="p-4">
        <div className="bg-card rounded-xl p-6">
          {err || 'الوظيفة غير موجودة.'}
          <div className="mt-4">
            <Link to="/announcements" className="underline">الرجوع للإعلانات</Link>
          </div>
        </div>
      </div>
    );
  }

  const title = job.title || 'بدون عنوان';
  const company = job.company || '—';
  const location = job.location || '—';
  const employment = labels.employment[job.employment_type || job.type] || '—';
  const workplace  = labels.workplace[job.workplace_type || job.workplace] || '—';
  const createdAt = job.created_at || job.createdAt;
  const createdStr = createdAt ? new Date(createdAt).toLocaleString() : '';

  const toList = (x) => Array.isArray(x) ? x.filter(Boolean) : [];

  return (
    <div className="p-2 sm:p-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* عنوان ذهبي */}
            <h1 className="text-xl sm:text-2xl font-extrabold mb-2 leading-tight" style={{ color: '#D4AF37' }}>
              {title}
            </h1>
            <div className="text-xs sm:text-sm text-gray-600 mb-4">{createdStr}</div>

            {/* معلومات أساسية - محسّنة للموبايل */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-[15px] mb-6">
              <div className="flex justify-between sm:block p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                <span className="font-medium text-gray-600">الشركة:</span> 
                <span className="text-gray-900">{company}</span>
              </div>
              <div className="flex justify-between sm:block p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                <span className="font-medium text-gray-600">الموقع:</span> 
                <span className="text-gray-900">{location}</span>
              </div>
              <div className="flex justify-between sm:block p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                <span className="font-medium text-gray-600">نوع الدوام:</span> 
                <span className="text-gray-900">{employment}</span>
              </div>
              <div className="flex justify-between sm:block p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                <span className="font-medium text-gray-600">نمط العمل:</span> 
                <span className="text-gray-900">{workplace}</span>
              </div>
              {job.max_applicants > 0 && (
                <div className="flex justify-between sm:block p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none col-span-full sm:col-span-1">
                  <span className="font-medium text-gray-600">الحد الأقصى:</span> 
                  <span className="text-gray-900">{job.max_applicants}</span>
                </div>
              )}
            </div>

            {job.description && (
              <section className="mb-6">
                <h2 className="font-bold mb-3 text-base sm:text-lg text-gray-800 border-b border-gray-200 pb-2">
                  وصف الوظيفة
                </h2>
                <div className="prose max-w-none whitespace-pre-line text-sm sm:text-base leading-relaxed text-gray-700 p-4 bg-gray-50 rounded-lg">
                  {job.description}
                </div>
              </section>
            )}

            {toList(job.requirements).length > 0 && (
              <section className="mb-6">
                <h2 className="font-bold mb-3 text-base sm:text-lg text-gray-800 border-b border-gray-200 pb-2">
                  المتطلبات المطلوبة
                </h2>
                <ul className="list-disc pr-6 space-y-2 text-sm sm:text-base">
                  {toList(job.requirements).map((li, i) => (
                    <li key={`req-${i}`} className="text-gray-700 leading-relaxed">{li}</li>
                  ))}
                </ul>
              </section>
            )}

            {toList(job.responsibilities).length > 0 && (
              <section className="mb-6">
                <h2 className="font-bold mb-3 text-base sm:text-lg text-gray-800 border-b border-gray-200 pb-2">
                  المسؤوليات الوظيفية
                </h2>
                <ul className="list-disc pr-6 space-y-2 text-sm sm:text-base">
                  {toList(job.responsibilities).map((li, i) => (
                    <li key={`res-${i}`} className="text-gray-700 leading-relaxed">{li}</li>
                  ))}
                </ul>
              </section>
            )}

            {toList(job.benefits).length > 0 && (
              <section className="mb-6">
                <h2 className="font-bold mb-3 text-base sm:text-lg text-gray-800 border-b border-gray-200 pb-2">
                  المزايا والفوائد
                </h2>
                <ul className="list-disc pr-6 space-y-2 text-sm sm:text-base">
                  {toList(job.benefits).map((li, i) => (
                    <li key={`ben-${i}`} className="text-gray-700 leading-relaxed">{li}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8">
              {/* رسائل النجاح والخطأ */}
              {applicationSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm sm:text-base">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    تم التقديم على الوظيفة بنجاح! سيتم مراجعة طلبك قريباً.
                  </div>
                </div>
              )}
              
              {applicationError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm sm:text-base">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {applicationError}
                  </div>
                </div>
              )}

              {/* نموذج التقديم - محسّن للموبايل */}
              {showApplicationForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-bold mb-4 text-base sm:text-lg">التقديم على الوظيفة</h3>
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-medium mb-2 text-gray-700">
                        خطاب التغطية (اختياري)
                      </label>
                      <textarea
                        id="coverLetter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="اكتب خطاب التغطية هنا..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-vertical min-h-[120px] text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resumeUrl" className="block text-sm font-medium mb-2 text-gray-700">
                        رابط السيرة الذاتية (اختياري)
                      </label>
                      <input
                        type="url"
                        id="resumeUrl"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        placeholder="https://example.com/your-resume.pdf"
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={applying}
                        className="flex-1 sm:flex-none bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-colors min-h-[44px] flex items-center justify-center"
                        aria-label="تأكيد التقديم على الوظيفة"
                      >
                        {applying ? (
                          <>
                            <svg className="animate-spin -ml-1 ml-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            جاري التقديم...
                          </>
                        ) : (
                          'تأكيد التقديم'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApplicationForm(false)}
                        className="px-6 py-3 rounded-lg text-sm sm:text-base border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors min-h-[44px] flex items-center justify-center"
                        aria-label="إلغاء التقديم"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* أزرار الإجراءات - محسّنة للموبايل */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isAuthenticated && !applicationSuccess && !showApplicationForm && (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-colors min-h-[44px] flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="فتح نموذج التقديم على الوظيفة"
                  >
                    التقديم على الوظيفة
                  </button>
                )}
                
                {job.application_url && (
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-colors min-h-[44px] flex items-center justify-center focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label="التقديم الخارجي (يفتح في نافذة جديدة)"
                  >
                    التقديم الخارجي
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                
                <Link 
                  to="/announcements" 
                  className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm sm:text-base border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors min-h-[44px] flex items-center justify-center text-gray-700"
                  aria-label="العودة إلى قائمة الإعلانات"
                >
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  الرجوع للإعلانات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
