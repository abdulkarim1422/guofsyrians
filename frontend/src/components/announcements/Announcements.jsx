// frontend/src/components/announcements/Announcements.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '@/utils/api';
import JobActions from '@/components/Admin/JobActions';
// لو عندك سياق مصادقة استخدمه، وإلا سنسقط على localStorage
import { useAuth } from '@/contexts/AuthContext'; // اختياري

const Announcements = ({ onSidebarHide }) => {
  const auth = (() => {
    try { return useAuth?.(); } catch { return null; }
  })();

  const isAdmin = useMemo(() => {
    // حاول القراءة من السياق أولاً، ثم من localStorage كخطة بديلة
    const u = auth?.user ?? (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
    return !!(u && (u.role === 'admin' || u.is_admin === true));
  }, [auth?.user]);

  const [filter, setFilter] = useState('all'); // all | jobs | (high/medium/low إن رغبت)
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');

  const mapJobs = useCallback((list) => {
    return list.map((j) => {
      const created = j.created_at ? new Date(j.created_at) : new Date();
      const date = created.toISOString().slice(0, 10);
      const time = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        id: `job-${j.id}`,
        rawId: j.id,
        title: j.title ? `وظيفة: ${j.title}` : 'وظيفة',
        content: [
          j.company ? `الشركة: ${j.company}` : null,
          j.location ? `الموقع: ${j.location}` : null,
          labelEmployment(j.employment_type) ? `الدوام: ${labelEmployment(j.employment_type)}` : null,
          labelWorkplace(j.workplace_type) ? `نمط العمل: ${labelWorkplace(j.workplace_type)}` : null,
          j.benefits ? `المزايا: ${Array.isArray(j.benefits) ? j.benefits.join('، ') : j.benefits}` : null,
        ].filter(Boolean).join(' • '),
        date,
        time,
        author: j.company || 'وظائف الاتحاد',
        priority: 'low',
        category: 'وظائف',
        type: 'job',
        is_active: j.is_active !== false,
        application_url: j.application_url || '',
        max_applicants: j.max_applicants ?? 0,
      };
    });
  }, []);

  // دالة إعادة التحميل بحيث نستعملها بعد الحذف/التفعيل
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      setError('');
      const list = await jobsAPI.list?.();
      setJobs(Array.isArray(list) ? mapJobs(list) : []);
    } catch (e) {
      setError('تعذر جلب الوظائف. حاول لاحقاً.');
    } finally {
      setLoadingJobs(false);
    }
  }, [mapJobs]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadJobs();
      if (!mounted) return;
    })();
    return () => { mounted = false; };
  }, [loadJobs]);

  // نعرض فقط الوظائف النشطة للجمهور
  const merged = useMemo(() => jobs.filter(j => j.is_active !== false), [jobs]);

  const filteredAnnouncements = merged.filter((item) => {
    const passesTab =
      filter === 'all'
        ? true
        : filter === 'jobs'
          ? item.type === 'job'
          : item.priority === filter;

    const q = searchTerm.trim().toLowerCase();
    const passesSearch =
      q === '' ||
      (item.title || '').toLowerCase().includes(q) ||
      (item.content || '').toLowerCase().includes(q) ||
      (item.author || '').toLowerCase().includes(q);

    return passesTab && passesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={onSidebarHide}
        className="fixed top-4 left-4 z-20 lg:hidden bg-white rounded-lg p-2 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main content */}
      <div className="flex-1 lg:ml-20 xl:ml-60 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعلانات</h1>
            <p className="text-gray-600">هنا تظهر الوظائف المنشورة من النظام مباشرة</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ابحث عن وظيفة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <TabBtn v="all" cur={filter} set={setFilter}>الكل</TabBtn>
                <TabBtn v="jobs" cur={filter} set={setFilter}>وظائف</TabBtn>
              </div>
            </div>
          </div>

          {/* Error / Loading */}
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          {loadingJobs && (
            <div className="text-center text-xs text-gray-500 mt-4 mb-6">
              جاري جلب الوظائف…
            </div>
          )}

          {/* Jobs Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                        وظائف
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.category || 'وظائف'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                    {item.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-gray-500">
                      {item.max_applicants > 0 && (
                        <span>الحد الأقصى للمتقدمين: {item.max_applicants}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* زر الجمهور */}
                      {item.application_url ? (
                        <a
                          href={item.application_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-3 py-1 rounded-lg bg-[#295a45] hover:bg-[#214937] text-white"
                        >
                          التقديم
                        </a>
                      ) : (
                        <Link
                          to={`/jobs/${item.rawId}`}
                          className="text-xs px-3 py-1 rounded-lg bg-[#295a45] hover:bg-[#214937] text-white"
                        >
                          التفاصيل
                        </Link>
                      )}

                      {/* أزرار الإدارة (تظهر للأدمن فقط) */}
                      {isAdmin && (
                        <JobActions
                          job={{ id: item.rawId, is_active: item.is_active }}
                          onChanged={loadJobs}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {!loadingJobs && filteredAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد وظائف حالياً</h3>
              <p className="text-gray-600">سيتم عرض الوظائف هنا فور نشرها.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function TabBtn({ v, cur, set, children }) {
  const active = cur === v;
  const base = active
    ? 'bg-blue-100 text-blue-800 border border-blue-200'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  return (
    <button onClick={() => set(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${base}`}>
      {children}
    </button>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
function getPriorityLabel(priority) {
  switch (priority) {
    case 'high': return 'عاجل';
    case 'medium': return 'متوسط';
    case 'low': return 'عادي';
    default: return 'عادي';
  }
}

function labelEmployment(v) {
  const map = { full_time: 'دوام كامل', part_time: 'دوام جزئي', contract: 'عقد/فريلانس', internship: 'تدريب', temporary: 'مؤقت' };
  return map[v] || '';
}
function labelWorkplace(v) {
  const map = { onsite: 'حضوري', remote: 'عن بُعد', hybrid: 'هجين' };
  return map[v] || '';
}

export default Announcements;
