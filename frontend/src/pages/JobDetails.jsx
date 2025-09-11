import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '@/utils/api'; // نفس ملف الـ API اللي فيه jobsAPI.get

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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
    <div className="p-4">
      <div className="rounded-2xl bg-white/95 shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          {/* عنوان ذهبي */}
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#D4AF37' }}>{title}</h1>
          <div className="text-sm text-gray-600 mb-2">{createdStr}</div>

          {/* معلومات أساسية */}
          <div className="grid md:grid-cols-2 gap-4 text-[15px] leading-8">
            <div><span className="opacity-80">الشركة:</span> {company}</div>
            <div><span className="opacity-80">الموقع:</span> {location}</div>
            <div><span className="opacity-80">الدوام:</span> {employment}</div>
            <div><span className="opacity-80">نمط العمل:</span> {workplace}</div>
            {job.max_applicants > 0 && (
              <div><span className="opacity-80">الحد الأقصى للمتقدمين:</span> {job.max_applicants}</div>
            )}
          </div>

          {job.description && (
            <section className="mt-6">
              <h2 className="font-bold mb-2">الوصف</h2>
              <div className="prose max-w-none whitespace-pre-line">{job.description}</div>
            </section>
          )}

          {toList(job.requirements).length > 0 && (
            <section className="mt-6">
              <h2 className="font-bold mb-2">المتطلبات</h2>
              <ul className="list-disc pr-6">
                {toList(job.requirements).map((li, i) => <li key={`req-${i}`}>{li}</li>)}
              </ul>
            </section>
          )}

          {toList(job.responsibilities).length > 0 && (
            <section className="mt-6">
              <h2 className="font-bold mb-2">المسؤوليات</h2>
              <ul className="list-disc pr-6">
                {toList(job.responsibilities).map((li, i) => <li key={`res-${i}`}>{li}</li>)}
              </ul>
            </section>
          )}

          {toList(job.benefits).length > 0 && (
            <section className="mt-6">
              <h2 className="font-bold mb-2">المزايا</h2>
              <ul className="list-disc pr-6">
                {toList(job.benefits).map((li, i) => <li key={`ben-${i}`}>{li}</li>)}
              </ul>
            </section>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {job.application_url && (
              <a
                href={job.application_url}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm"
              >
                التقديم على الوظيفة
              </a>
            )}
            <Link to="/announcements" className="px-4 py-2 rounded-lg text-sm border">
              الرجوع للإعلانات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
