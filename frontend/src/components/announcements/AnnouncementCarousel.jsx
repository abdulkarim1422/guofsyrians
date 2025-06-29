import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy announcements data for the carousel
const announcementData = [
  {
    id: 1,
    title: 'إعلان هام حول الامتحانات النهائية',
    brief: 'يُعلن الاتحاد العام عن مواعيد الامتحانات النهائية للفصل الدراسي الحالي',
    date: '2025-06-29',
    time: '10:30 AM',
    priority: 'high'
  },
  {
    id: 2,
    title: 'فعالية ثقافية: أمسية شعرية',
    brief: 'يسر الاتحاد العام دعوتكم لحضور الأمسية الشعرية في القاعة الكبرى',
    date: '2025-06-28',
    time: '03:15 PM',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'تنبيه: صيانة المكتبة',
    brief: 'ستكون المكتبة الرئيسية مغلقة مؤقتاً لإجراء أعمال الصيانة',
    date: '2025-06-27',
    time: '09:00 AM',
    priority: 'medium'
  }
];

const AnnouncementCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcementData.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAnnouncement = announcementData[currentIndex];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const handleClick = () => {
    navigate('/announcements');
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer transition-transform hover:scale-105 duration-200"
    >
      <div
        className="rounded-xl w-full h-full px-3 sm:px-0 xl:px-3 overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Priority indicator */}
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getPriorityColor(currentAnnouncement.priority)}`} />
        
        <div className="block sm:hidden xl:block pt-3 text-white">
          <div className="font-bold text-gray-100 text-sm mb-1">آخر الإعلانات</div>
          
          <div className="mb-2">
            <h3 className="text-sm font-semibold line-clamp-2 mb-1">
              {currentAnnouncement.title}
            </h3>
            <p className="text-xs text-gray-200 line-clamp-2">
              {currentAnnouncement.brief}
            </p>
          </div>
          
          <div className="text-xs text-gray-300 mb-2">
            {currentAnnouncement.time} - {currentAnnouncement.date}
          </div>

          {/* Pagination dots */}
          <div className="flex space-x-1 mb-2">
            {announcementData.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-400'
                }`}
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

        {/* Mobile/Small screen version */}
        <div className="hidden sm:block xl:hidden p-4">
          <div className="text-center">
            <div className={`w-8 h-8 mx-auto rounded-full ${getPriorityColor(currentAnnouncement.priority)} flex items-center justify-center mb-2`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div className="text-white text-xs font-bold">إعلانات</div>
            <div className="flex justify-center space-x-1 mt-2">
              {announcementData.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full ${
                    index === currentIndex ? 'bg-white' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCarousel;
