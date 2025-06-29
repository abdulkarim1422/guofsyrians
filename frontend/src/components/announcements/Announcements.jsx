import { useState } from 'react';

// Dummy announcements data
const dummyAnnouncements = [
  {
    id: 1,
    title: 'إعلان هام حول الامتحانات النهائية',
    content: 'يُعلن الاتحاد العام عن مواعيد الامتحانات النهائية للفصل الدراسي الحالي. يرجى من جميع الطلاب مراجعة الجدول الزمني والتحضير للامتحانات.',
    date: '2025-06-29',
    time: '10:30 AM',
    author: 'إدارة الاتحاد',
    priority: 'high',
    category: 'أكاديمي'
  },
  {
    id: 2,
    title: 'فعالية ثقافية: أمسية شعرية',
    content: 'يسر الاتحاد العام دعوتكم لحضور الأمسية الشعرية التي ستقام في القاعة الكبرى. سيشارك نخبة من الشعراء المحليين والطلاب.',
    date: '2025-06-28',
    time: '03:15 PM',
    author: 'النشاطات الثقافية',
    priority: 'medium',
    category: 'فعاليات'
  },
  {
    id: 3,
    title: 'تنبيه: صيانة المكتبة',
    content: 'تُعلم إدارة المكتبة الطلاب أنه سيتم إجراء أعمال صيانة في المكتبة الرئيسية. المكتبة ستكون مغلقة مؤقتاً.',
    date: '2025-06-27',
    time: '09:00 AM',
    author: 'إدارة المكتبة',
    priority: 'medium',
    category: 'خدمات'
  },
  {
    id: 4,
    title: 'ورشة عمل: مهارات الكتابة الأكاديمية',
    content: 'تنظم وحدة التطوير الأكاديمي ورشة عمل حول مهارات الكتابة الأكاديمية للطلاب. التسجيل مفتوح الآن.',
    date: '2025-06-26',
    time: '11:45 AM',
    author: 'التطوير الأكاديمي',
    priority: 'low',
    category: 'تدريب'
  },
  {
    id: 5,
    title: 'إعلان منح دراسية',
    content: 'يعلن الاتحاد عن توفر منح دراسية للطلاب المتفوقين. يرجى مراجعة شروط التقديم والمواعيد النهائية.',
    date: '2025-06-25',
    time: '02:20 PM',
    author: 'شؤون الطلاب',
    priority: 'high',
    category: 'منح'
  },
  {
    id: 6,
    title: 'بطولة كرة القدم الجامعية',
    content: 'تبدأ بطولة كرة القدم السنوية بين كليات الجامعة. فرق متميزة وجوائز قيمة في انتظاركم.',
    date: '2025-06-24',
    time: '04:00 PM',
    author: 'النشاطات الرياضية',
    priority: 'medium',
    category: 'رياضة'
  }
];

const Announcements = ({ onSidebarHide }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'عاجل';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'عادي';
      default:
        return 'عادي';
    }
  };

  const filteredAnnouncements = dummyAnnouncements.filter(announcement => {
    const matchesFilter = filter === 'all' || announcement.priority === filter;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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
            <p className="text-gray-600">جميع الإعلانات والأخبار المهمة من الاتحاد العام</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="البحث في الإعلانات..."
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

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilter('high')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'high'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  عاجل
                </button>
                <button
                  onClick={() => setFilter('medium')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  متوسط
                </button>
                <button
                  onClick={() => setFilter('low')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'low'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  عادي
                </button>
              </div>
            </div>
          </div>

          {/* Announcements Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                      {getPriorityLabel(announcement.priority)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {announcement.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {announcement.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {announcement.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {announcement.author}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {announcement.time} - {announcement.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
              <p className="text-gray-600">لم يتم العثور على إعلانات تطابق معايير البحث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
