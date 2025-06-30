import clsx from 'clsx';
import { useSpring, animated, config } from '@react-spring/web';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

const map = (value, sMin, sMax, dMin, dMax) => {
  return dMin + ((value - sMin) / (sMax - sMin)) * (dMax - dMin);
};
const pi = Math.PI;
const tau = 2 * pi;

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
                <div className="text-3xl font-bold text-white">أهلاً وسهلاً {user?.name || 'User'}</div>
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
        <div className="w-full p-2 lg:w-1/3">
          <div className="rounded-lg bg-card h-80">
            <MemberSatisfaction />
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

function MemberSatisfaction() {
  const { dashOffset } = useSpring({
    dashOffset: 78.54,
    from: { dashOffset: 785.4 },
    config: config.molasses,
  });
  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center">
        <div className="text-white font-bold">رضا الأعضاء</div>
        <Icon path="res-react-dash-options" className="w-2 h-2" />
      </div>
      <div className="mt-3">من جميع الأنشطة</div>
      <div className="flex justify-center">
        <svg
          viewBox="0 0 700 380"
          fill="none"
          width="300"
          xmlns="http://www.w3.org/2000/svg"
          id="svg"
        >
          <path
            d="M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350"
            stroke="#2d2d2d"
            strokeWidth="40"
            strokeLinecap="round"
          />
          <animated.path
            d="M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350"
            stroke="#2f49d0"
            strokeWidth="40"
            strokeLinecap="round"
            strokeDasharray="785.4"
            strokeDashoffset={dashOffset}
            id="svgPath"
            className="svgPath"
          />

          <animated.circle
            cx={dashOffset.to(
              (x) => 350 + 250 * Math.cos(map(x, 785.4, 0, pi, tau)),
            )}
            cy={dashOffset.to(
              (x) => 350 + 250 * Math.sin(map(x, 785.4, 0, pi, tau)),
            )}
            r="12"
            fill="#fff"
          />
          <circle cx="140" cy="350" r="5" fill="#2f49d0" />
          <circle
            cx="144.5890038459008"
            cy="306.3385449282706"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="158.15545389505382"
            cy="264.58530495408195"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="180.10643118126103"
            cy="226.56509701858067"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="209.48257266463972"
            cy="193.93958664974724"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="244.9999999999999"
            cy="168.1346652052679"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="285.10643118126103"
            cy="150.27813157801776"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="328.0490227137926"
            cy="141.15040197266262"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="371.95097728620715"
            cy="141.1504019726626"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="414.8935688187389"
            cy="150.27813157801774"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="454.9999999999999"
            cy="168.1346652052678"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="490.51742733536014"
            cy="193.93958664974713"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="519.8935688187389"
            cy="226.5650970185806"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="541.8445461049462"
            cy="264.58530495408183"
            r="5"
            fill="#2f49d0"
          />
          <circle
            cx="555.4109961540992"
            cy="306.33854492827044"
            r="5"
            fill="#2f49d0"
          />
          <circle cx="560" cy="349.99999999999994" r="5" fill="#2f49d0" />
          <path
            d="M349.292 375C395.845 375 433.583 337.261 433.583 290.708C433.583 244.155 395.845 206.417 349.292 206.417C302.739 206.417 265 244.155 265 290.708C265 337.261 302.739 375 349.292 375Z"
            fill="white"
          />
          <path
            d="M349.292 358.708C386.847 358.708 417.292 328.264 417.292 290.708C417.292 253.153 386.847 222.708 349.292 222.708C311.736 222.708 281.292 253.153 281.292 290.708C281.292 328.264 311.736 358.708 349.292 358.708Z"
            fill="#D2D6E7"
          />
          <path
            d="M347.167 343.833C376.898 343.833 401 319.731 401 290C401 260.269 376.898 236.167 347.167 236.167C317.435 236.167 293.333 260.269 293.333 290C293.333 319.731 317.435 343.833 347.167 343.833Z"
            fill="#FFE17D"
          />
          <path
            d="M347.167 316.482C339.696 316.482 332.608 313.623 328.204 308.835C327.391 307.953 327.449 306.58 328.331 305.768C329.213 304.956 330.588 305.013 331.399 305.896C334.996 309.807 340.89 312.141 347.167 312.141C353.443 312.141 359.338 309.807 362.935 305.896C363.745 305.013 365.121 304.956 366.003 305.768C366.885 306.58 366.942 307.953 366.13 308.835C361.725 313.623 354.637 316.482 347.167 316.482Z"
            fill="#AA7346"
          />
          <path
            d="M328.933 290C326.535 290 324.592 288.056 324.592 285.659V282.186C324.592 279.788 326.535 277.844 328.933 277.844C331.33 277.844 333.274 279.788 333.274 282.186V285.659C333.274 288.056 331.33 290 328.933 290Z"
            fill="#7D5046"
          />
          <path
            d="M328.933 277.844C328.635 277.844 328.345 277.875 328.064 277.932V283.922C328.064 285.361 329.231 286.527 330.669 286.527C332.108 286.527 333.274 285.361 333.274 283.922V282.186C333.274 279.788 331.331 277.844 328.933 277.844Z"
            fill="#9C6846"
          />
          <path
            d="M365.401 290C363.003 290 361.059 288.056 361.059 285.659V282.186C361.059 279.788 363.003 277.844 365.401 277.844C367.798 277.844 369.742 279.788 369.742 282.186V285.659C369.742 288.056 367.798 290 365.401 290Z"
            fill="#7D5046"
          />
          <path
            d="M365.401 277.844C365.103 277.844 364.813 277.875 364.532 277.932V283.922C364.532 285.361 365.699 286.527 367.137 286.527C368.576 286.527 369.742 285.361 369.742 283.922V282.186C369.742 279.788 367.798 277.844 365.401 277.844Z"
            fill="#9C6846"
          />
          <path
            d="M354.981 336.019C325.25 336.019 301.148 311.917 301.148 282.186C301.148 269.31 305.673 257.496 313.213 248.232C301.085 258.103 293.333 273.144 293.333 290C293.333 319.731 317.435 343.833 347.167 343.833C364.023 343.833 379.064 336.081 388.935 323.953C379.671 331.493 367.857 336.019 354.981 336.019Z"
            fill="#FFD164"
          />
        </svg>
      </div>

      <div className="flex justify-center">
        <div className="flex justify-between mt-2" style={{ width: '300px' }}>
          <div className="" style={{ width: '50px', paddingLeft: '16px' }}>
            0%
          </div>
          <div
            className=""
            style={{
              width: '150px',
              textAlign: 'center',
            }}
          >
            <div
              className="font-bold"
              style={{ color: '#2f49d1', fontSize: '18px' }}
            >
              85%
            </div>
            <div className="">نسبة الرضا العام</div>
          </div>
          <div className="" style={{ width: '50px' }}>
            100%
          </div>
        </div>
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
