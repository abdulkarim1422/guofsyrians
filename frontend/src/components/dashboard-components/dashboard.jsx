import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

const academicLevelData = [
  { c1: 'Lisans (Bachelor)', c2: '245', c3: '#363636', color: '#535353' },
  { c1: 'Yüksek Lisans (Master)', c2: '156', c3: '#818bb1', color: '#595f77' },
  { c1: 'Doktora (PhD)', c2: '89', c3: '#2c365d', color: '#232942' },
  { c1: 'Ön Lisans (Associate)', c2: '67', c3: '#334ed8', color: '#2c3051' },
];

function DashboardContent({ onSidebarHide }) {
  const { user } = useAuth();
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
        
        // Calculate statistics
        const totalMembers = members.length;
        const universities = new Set(members.map(member => member.university).filter(Boolean));
        const totalUniversities = universities.size;
        
        // Calculate new members this month (you can adjust this logic based on your data)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newMembersThisMonth = members.filter(member => {
          if (!member.created_at) return false;
          const memberDate = new Date(member.created_at);
          return memberDate.getMonth() === currentMonth && memberDate.getFullYear() === currentYear;
        }).length;

        setMemberStats({
          totalMembers,
          newMembersThisMonth: newMembersThisMonth || 42, // fallback to mock data
          totalUniversities,
          activeEvents: 156 // This would need a separate API call for events
        });
      } catch (error) {
        console.error('Failed to fetch member statistics:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStats();
  }, []);
  
  return (
    <div className="flex w-full">
      <div className="w-full h-screen hidden sm:block sm:w-20 xl:w-60 flex-shrink-0">
        .
      </div>
      <div className=" h-screen flex-grow overflow-x-hidden overflow-auto flex flex-wrap content-start p-2">          
        <div className="w-full sm:flex p-2 items-end">
          <div className="sm:flex-grow flex justify-between">
            <div className="">
              <div className="flex items-center">
                <div className="text-3xl font-bold dashboard-welcome-text">أهلاً وسهلاً {user?.name || 'User'}</div>
                <div className="flex items-center p-2 bg-card ml-2 rounded-xl">
                  <Icon path="res-react-dash-premium-star" />
                  <div className="ml-2 font-bold text-premium-yellow">
                    الاتحاد السوري
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Icon
                  path="res-react-dash-date-indicator"
                  className="w-3 h-3"
                />
                <div className="ml-2">{new Date().toLocaleDateString('ar-u-ca-islamic', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
            </div>
            <IconButton
              icon="res-react-dash-sidebar-open"
              className="block sm:hidden"
              onClick={onSidebarHide}
            />
          </div>
        </div>
        {/* Quick Stats Section */}
        <div className="w-full p-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : memberStats.totalMembers}
                  </div>
                  <div className="text-sm opacity-80">إجمالي الأعضاء</div>
                </div>
                <Icon path="res-react-dash-tick" className="w-8 h-8 opacity-60" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : memberStats.newMembersThisMonth}
                  </div>
                  <div className="text-sm opacity-80">أعضاء جدد هذا الشهر</div>
                </div>
                <Icon path="res-react-dash-premium-star" className="w-8 h-8 opacity-60" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : memberStats.totalUniversities}
                  </div>
                  <div className="text-sm opacity-80">جامعات مختلفة</div>
                </div>
                <Icon path="res-react-dash-graph-range" className="w-8 h-8 opacity-60" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : memberStats.activeEvents}
                  </div>
                  <div className="text-sm opacity-80">فعالية نشطة</div>
                </div>
                <Icon path="res-react-dash-add-component" className="w-8 h-8 opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Banner for New Users */}
        {user?.role === 'member' && (
          <div className="w-full p-2">
            <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    مرحباً بك في الاتحاد العام للطلاب السوريين
                  </h3>
                  <p className="text-blue-100 mb-4">
                    استكشف الخدمات المتاحة، تواصل مع زملائك الطلاب، وشارك في الفعاليات والأنشطة المختلفة
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      تحديث البروفايل
                    </button>
                    <button className="bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      استكشاف الطلاب
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Icon path="res-react-dash-premium-star" className="w-16 h-16 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Components Grid */}
        <div className="w-full p-2 lg:w-1/3">
          <div className="rounded-lg bg-card h-80">
            <AcademicLevelBreakdown />
          </div>
        </div>
      </div>
    </div>
  );
}

function AcademicLevelBreakdown() {
  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-white font-bold">توزيع المستويات الأكاديمية</div>

        <Icon path="res-react-dash-options" className="w-2 h-2" />
      </div>
      <div className="mt-3">جميع الطلاب</div>
      {academicLevelData.map(({ c1, c2, c3, color }) => (
        <div className="flex items-center" key={c1}>
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: color,
            }}
          />
          <div className="ml-2" style={{ color }}>
            {c1}
          </div>
          <div className="flex-grow" />
          <div className="" style={{ color }}>
            {c2}
          </div>
          <div className="ml-2 w-12 card-stack-border" />
          <div className="ml-2 h-8">
            <div
              className="w-20 h-28 rounded-lg overflow-hidden"
              style={{
                background: c3,
              }}
            >
              {c1 === 'Doktora (PhD)' && (
                <img src="https://assets.codepen.io/3685267/res-react-dash-user-card.svg" alt="" />
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex mt-3 px-3 items-center justify-between bg-details rounded-xl w-36 h-12">
        <div className="">التفاصيل</div>
        <Icon path="res-react-dash-chevron-right" className="w-4 h-4" />
      </div>
    </div>
  );
}

function AddComponent() {
  return (
    <div>
      <div className="w-full h-20 add-component-head" />
      <div
        className="flex flex-col items-center"
        style={{
          transform: 'translate(0, -40px)',
        }}
      >
        <div
          className=""
          style={{
            background: '#414455',
            width: '80px',
            height: '80px',
            borderRadius: '999px',
          }}
        >
          <img
            src="https://assets.codepen.io/3685267/res-react-dash-rocket.svg"
            alt=""
            className="w-full h-full"
          />
        </div>
        <div className="text-white font-bold mt-3">
          No components Created Yet
        </div>
        <div className="mt-2">Simply create your first component</div>
        <div className="mt-1">Just click on the button</div>
        <div
          className="flex items-center p-3 mt-3"
          style={{
            background: '#2f49d1',
            borderRadius: '15px',
            padding: '8px 16px',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Icon path="res-react-dash-add-component" className="w-5 h-5" />
          <div className="ml-2">Add Component</div>
          <div
            className="ml-2"
            style={{
              background: '#4964ed',
              borderRadius: '15px',
              padding: '4px 8px 4px 8px',
            }}
          >
            129
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon({ path = 'options', className = 'w-4 h-4' }) {
  return (
    <img
      src={`https://assets.codepen.io/3685267/${path}.svg`}
      alt=""
      className={clsx(className)}
    />
  );
}

function IconButton({
  onClick = () => {},
  icon = 'options',
  className = 'w-4 h-4',
}) {
  return (
    <button onClick={onClick} type="button" className={className}>
      <img
        src={`https://assets.codepen.io/3685267/${icon}.svg`}
        alt=""
        className="w-full h-full"
      />
    </button>
  );
}

function Image({ path = '1', className = 'w-4 h-4' }) {
  return (
    <img
      src={`https://assets.codepen.io/3685267/${path}.jpg`}
      alt=""
      className={clsx(className, 'rounded-full')}
    />
  );
}

export default DashboardContent;
