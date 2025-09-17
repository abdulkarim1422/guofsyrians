import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '@/utils/api';

// بيانات افتراضية للإعلانات (تظل موجودة)
const announcementSeed = [
  {
    id: 'a-1',
    title: 'إعلان هام حول الامتحانات النهائية',
    brief: 'يُعلن الاتحاد العام عن مواعيد الامتحانات النهائية للفصل الدراسي الحالي',
    date: '2025-06-29',
    time: '10:30 AM',
    priority: 'high',
    type: 'announcement',
  },
  {
    id: 'a-2',
    title: 'فعالية ثقافية: أمسية شعرية',
    brief: 'يسر الاتحاد العام دعوتكم لحضور الأمسية الشعرية في القاعة الكبرى',
    date: '2025-06-28',
    time: '03:15 PM',
    priority: 'medium',
    type: 'announcement',
  },
  {
    id: 'a-3',
    title: 'تنبيه: صيانة المكتبة',
    brief: 'ستكون المكتبة الرئيسية مغلقة مؤقتاً لإجراء أعمال الصيانة',
    date: '2025-06-27',
    time: '09:00 AM',
    priority: 'medium',
    type: 'announcement',
  },
];

const AnnouncementCarousel = () => {
  const [items, setItems] = useState(announcementSeed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // اجلب آخر الوظائف وأدمجها مع الإعلانات
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const jobs = await jobsAPI.list?.(); // لو غير متوفر ترجع undefined
        if (mounted && Array.isArray(jobs) && jobs.length) {
          // خذ 3 وظائف أخيرة كحد أقصى
          const jobCards = jobs
            .filter(j => j?.is_active !== false)
            .slice(0, 3)
            .map(j => {
              const created = j.created_at ? new Date(j.created_at) : new Date();
              const date = created.toISOString().slice(0, 10);
              const time = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return {
                id: `job-${j.id}`,
                title: `وظيفة: ${j.title} • ${j.company ?? ''}`.trim(),
                brief: `${j.location ?? ''} • ${labelEmployment(j.employment_type)} • ${labelWorkplace(j.workplace_type)}`.replace(/^ • /, ''),
                date,
                time,
                priority: 'low',
                type: 'job',
              };
            });
          // دمج وإعادة ترتيب (الأحدث في البداية)
          const merged = [...jobCards, ...announcementSeed];
          setItems(merged);
        }
      } catch {
        // تجاهل الخطأ واستخدم البيانات الافتراضية فقط
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const current = items[currentIndex] || announcementSeed[0];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const handleClick = () => navigate('/announcements');

  return (
    <div onClick={handleClick} className="cursor-pointer transition-transform hover:scale-105 duration-200">
      <div
        className="rounded-xl w-full h-full px-3 sm:px-0 xl:px-3 overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        {/* أولوية */}
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getPriorityColor(current.priority)}`} />

        {/* شارة نوع البطاقة */}
        <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white">
          {current.type === 'job' ? 'وظيفة' : 'إعلان'}
        </div>

        {/* نسخة الشاشات الكبيرة */}
        <div className="block sm:hidden xl:block pt-3 text-white">
          <div className="font-bold text-gray-100 text-sm mb-1">آخر المستجدات</div>
          <div className="mb-2">
            <h3 className="text-sm font-semibold line-clamp-2 mb-1">{current.title}</h3>
            <p className="text-xs text-gray-200 line-clamp-2">{current.brief}</p>
          </div>
          <div className="text-xs text-gray-300 mb-2">{current.time} - {current.date}</div>
          <div className="flex space-x-1 mb-2">
            {items.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-300 flex items-center">
            <span>اضغط لعرض جميع الإعلانات</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* نسخة الشاشات الصغيرة/المتوسطة */}
        <div className="hidden sm:block xl:hidden p-4">
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto rounded-full ${getPriorityColor(current.priority)} flex items-center justify-center mb-2`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div className="text-white text-xs font-bold">{current.type === 'job' ? 'وظيفة' : 'إعلانات'}</div>
            <div className="flex justify-center space-x-1 mt-2">
              {items.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function labelEmployment(v) {
  const map = { full_time: 'دوام كامل', part_time: 'دوام جزئي', contract: 'عقد', internship: 'تدريب', temporary: 'مؤقت' };
  return map[v] || '';
}
function labelWorkplace(v) {
  const map = { onsite: 'حضوري', remote: 'عن بُعد', hybrid: 'هجين' };
  return map[v] || '';
}

export default AnnouncementCarousel;
