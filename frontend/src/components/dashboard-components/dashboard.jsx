import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ===================== الصفحة الرئيسية ===================== */
function DashboardContent() {
  const { user } = useAuth();

  // إحصائيات الأعضاء (كروت أعلى الصفحة)
  const [memberStats, setMemberStats] = useState({
    totalMembers: 557,
    newMembersThisMonth: 42,
    totalUniversities: 89,
    activeEvents: 156
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberStats = async () => {
      try {
        const { memberApi } = await import('../../utils/apiService');
        const members = await memberApi.getAllMembers();

        const totalMembers = members.length;
        const universities = new Set(members.map(m => m.university).filter(Boolean)).size;

        const now = new Date();
        const newMembersThisMonth = members.filter(m => {
          if (!m.created_at) return false;
          const d = new Date(m.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        setMemberStats({
          totalMembers,
          newMembersThisMonth: newMembersThisMonth || 42,
          totalUniversities: universities,
          activeEvents: 156
        });
      } catch (e) {
        console.error('Failed to fetch member statistics:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStats();
  }, []);

  return (
    <div className="flex w-full min-h-screen dashboard-tablet-container dashboard-desktop-container">
      <div className="w-full hidden sm:block sm:w-20 xl:w-60 flex-shrink-0">.</div>

      <div className="relative flex-grow overflow-x-hidden flex flex-wrap content-start p-2 dashboard-inner-content">
        {/* رأس الصفحة */}
        <div className="w-full sm:flex p-2 items-end">
          <div className="sm:flex-grow flex justify-between">
            <div>
              <div className="flex items-center">
                <div className="text-3xl font-bold dashboard-welcome-text">أهلاً وسهلاً {user?.name || 'User'}</div>
                {/* الاتحاد السوري card - مخفي */}
                {/* 
                <div className="flex items-center p-2 bg-card ml-2 rounded-xl">
                  <Icon path="res-react-dash-premium-star" />
                  <div className="ml-2 font-bold text-premium-yellow">الاتحاد السوري</div>
                </div>
                */}
              </div>
              <div className="flex items-center">
                <Icon path="res-react-dash-date-indicator" className="w-3 h-3" />
                <div className="ml-2">
                  {new Date().toLocaleDateString('ar-u-ca-islamic', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الكروت السريعة - مخفية 
        <div className="w-full p-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard value={loading ? '...' : memberStats.totalMembers} label="إجمالي الأعضاء" icon="res-react-dash-tick" gradient="from-blue-600 to-blue-800" />
            <StatCard value={loading ? '...' : memberStats.newMembersThisMonth} label="أعضاء جدد هذا الشهر" icon="res-react-dash-premium-star" gradient="from-green-600 to-green-800" />
            <StatCard value={loading ? '...' : memberStats.totalUniversities} label="جامعات مختلفة" icon="res-react-dash-graph-range" gradient="from-purple-600 to-purple-800" />
            <StatCard value={loading ? '...' : memberStats.activeEvents} label="فعالية نشطة" icon="res-react-dash-add-component" gradient="from-orange-600 to-orange-800" />
          </div>
        </div>
        */}

        {/* 👇 الوظائف الأخيرة — الآن بعرض كامل */}
        <div className="w-full p-2">
          <LatestJobsWidget isAdmin={user?.role === 'admin'} />
        </div>

        {/* 👇 ملخص الطلاب تحتها مباشرة */}
        {user?.role === 'admin' && (
          <div className="w-full p-2">
            <StudentsOverviewWidget />
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== وظائف أخيرة (يشبه الإعلانات) ===================== */
function LatestJobsWidget({ isAdmin = false }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { jobsAPI } = await import('../../utils/api');
        const data = await jobsAPI.list({ limit: 6, is_active: true });
        setJobs(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (e) {
        console.error('Failed to load latest jobs:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: '#D4AF37' }}>الوظائف الأخيرة</h3>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin/jobs/new"
              className="inline-flex items-center gap-2 text-white text-sm px-3 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#d6b549' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c4a73f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#d6b549'}
            >
              <span className="text-xl leading-none">+</span>
              إضافة وظيفة
            </Link>
          )}
          <Link to="/announcements" className="text-sm underline hover:opacity-80">عرض الكل</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-sm opacity-70">... جارِ التحميل</div>
      ) : jobs.length === 0 ? (
        <div className="text-sm opacity-70">لا توجد وظائف حالياً.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {jobs.map((j) => (
            <JobCard key={j.id ?? j._id} job={j} />
          ))}
        </div>
      )}
    </div>
  );
}

/* بطاقة وظيفة */
function JobCard({ job }) {
  const id = job.id ?? job._id;
  const title = job.title || 'بدون عنوان';
  const company = job.company || '—';
  const location = job.location || '—';

  const employment = job.employment_type || job.type || 'full_time';
  const workplace  = job.workplace_type  || job.workplace || 'onsite';

  const tEmployment = {
    full_time: 'دوام كامل',
    part_time: 'دوام جزئي',
    contract: 'عقد',
    internship: 'تدريب',
    temporary: 'مؤقت',
    freelance: 'حر',
    other: 'أخرى',
    'full-time': 'دوام كامل',
    'part-time': 'دوام جزئي'
  }[employment] || '—';

  const tWorkplace = { onsite: 'حضوري', remote: 'عن بعد', hybrid: 'هجين' }[workplace] || '—';

  const createdAt = job.created_at || job.createdAt;
  const dt = createdAt ? new Date(createdAt) : null;

  return (
    <div className="rounded-2xl bg-white/95 shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">عادي</span>
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">وظائف</span>
        </div>

        <Link to={`/jobs/${id}`} className="block font-bold text-lg mb-2" style={{ color: '#D4AF37' }}>
          {title}
        </Link>

        <div className="text-sm text-gray-700 leading-7">
          <span className="opacity-80">الشركة:</span> {company}
          <span className="mx-1">·</span>
          <span className="opacity-80">الموقع:</span> {location}
          <span className="mx-1">·</span>
          <span className="opacity-80">الدوام:</span> {tEmployment}
          <span className="mx-1">·</span>
          <span className="opacity-80">نمط العمل:</span> {tWorkplace}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">{company}</div>
        <div className="text-xs text-gray-500">{dt ? dt.toLocaleString() : ''}</div>
      </div>

      <div className="p-4">
        <Link
          to={`/jobs/${id}`}
          className="block w-full text-center text-white rounded-lg py-2 text-sm transition-colors"
          style={{ backgroundColor: '#d6b549' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c4a73f'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#d6b549'}
        >
          التفاصيل
        </Link>
      </div>
    </div>
  );
}

/* ===================== ملخص الطلاب (بسيط وخفيف) ===================== */
function StudentsOverviewWidget() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { memberApi } = await import('../../utils/apiService');
        const data = await memberApi.getAllMembers();
        setMembers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load members:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = members.length;
  const universities = new Set(members.map(m => m.university).filter(Boolean)).size;
  const latest = [...members]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 6);

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: '#D4AF37' }}>الطلاب</h3>
        <Link to="/students-list" className="text-sm underline hover:opacity-80">عرض الكل</Link>
      </div>

      {loading ? (
        <div className="text-sm opacity-70">... جارِ التحميل</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ملخص أرقام */}
          <div className="lg:col-span-1 space-y-3">
            <SummaryTile label="إجمالي الطلاب" value={total} />
            <SummaryTile label="عدد الجامعات" value={universities} />
          </div>

          {/* آخر الطلاب */}
          <div className="lg:col-span-2">
            {latest.length === 0 ? (
              <div className="text-sm opacity-70">لا يوجد طلاب.</div>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-xl bg-white/95 border border-gray-100">
                {latest.map((m) => (
                  <li key={m.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} />
                      <div>
                        <div className="font-semibold text-gray-900">{m.name}</div>
                        <div className="text-sm text-gray-600">
                          {m.major || m.professional_title || '—'} · {m.university || '—'}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/cv/${m.id}`}
                      className="text-sm text-white px-3 py-1.5 rounded-lg transition-colors"
                      style={{ backgroundColor: '#d6b549' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c4a73f'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#d6b549'}
                    >
                      السيرة
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="rounded-lg bg-white/95 border border-gray-100 p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-extrabold mt-1" style={{ color: '#D4AF37' }}>{value}</div>
    </div>
  );
}

function Avatar({ name = '' }) {
  const initials = name
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
      {initials || '؟'}
    </div>
  );
}

/* ====== كروت واحتمالات مساعدة ====== */
function StatCard({ value, label, icon, gradient }) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg p-4 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm opacity-80">{label}</div>
        </div>
        <Icon path={icon} className="w-8 h-8 opacity-60" />
      </div>
    </div>
  );
}

function Icon({ path = 'options', className = 'w-4 h-4' }) {
  return <img src={`https://assets.codepen.io/3685267/${path}.svg`} alt="" className={clsx(className)} />;
}

// Unused function - keeping for potential future use
// function IconButton({ onClick = () => {}, icon = 'options', className = 'w-4 h-4' }) {
//   return (
//     <button onClick={onClick} type="button" className={className}>
//       <img src={`https://assets.codepen.io/3685267/${icon}.svg`} alt="" className="w-full h-full" />
//     </button>
//   );
// }

export default DashboardContent;
