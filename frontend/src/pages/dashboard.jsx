import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import '@/styles/dashboard.css';
import DashboardContent from '@/components/dashboard-components/dashboard.jsx';
import StudentsList from '@/components/dashboard-components/StudentsList.jsx';
import Settings from '@/components/settings/Settings.jsx';
import ProfileSettings from '@/components/settings/ProfileSettings.jsx';
import Announcements from '@/components/announcements/Announcements.jsx';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { AttributionComponent } from '@/components/dashboard-components/attribution.jsx';
import About from '@/pages/about.jsx';
import { ResumeForm } from '@/pages/ResumeForm.jsx';

const sidebarItems = [
  [
    { id: '0', title: 'Dashboard', notifications: false },
    { id: '1', title: 'Students list', notifications: false },
    { id: '5', title: 'Edit Resume', notifications: false },
  ],
  [
    { id: '2', title: 'Settings', notifications: false },
    { id: '3', title: 'Announcements', notifications: false },
    { id: '4', title: 'About', notifications: false },
  ],
];

const DashboardApp = () => {
  const [showSidebar, onSetShowSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  useEffect(() => {
    // Apply dashboard styles to body
    document.body.className = 'dashboard-body';
    
    // Cleanup function to restore original body styles
    return () => {
      document.body.className = '';
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, setShowUserMenu]);

  // Get selected page from URL
  const getSelectedPageFromPath = (pathname) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return '0';
      case '/students-list':
        return '1';
      case '/settings':
        return '2';
      case '/announcements':
        return '3';
      case '/about':
        return '4';
      case '/edit-resume':
        return '5';
      case '/profile':
        return 'profile';
      default:
        return '0';
    }
  };

  const selectedPage = getSelectedPageFromPath(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePageSelect = (pageId) => {
    switch (pageId) {
      case '0':
        navigate('/dashboard');
        break;
      case '1':
        navigate('/students-list');
        break;
      case '2':
        navigate('/settings');
        break;
      case '3':
        navigate('/announcements');
        break;
      case '4':
        navigate('/about');
        break;
      case '5':
        navigate('/edit-resume');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const renderCurrentPage = () => {
    const currentPath = location.pathname;
    const content = (() => {
      switch (currentPath) {
        case '/':
        case '/dashboard':
          return <DashboardContent onSidebarHide={() => onSetShowSidebar(true)} />;
        case '/students-list':
          return <StudentsList onSidebarHide={() => onSetShowSidebar(true)} />;
        case '/settings':
          return <Settings onSidebarHide={() => onSetShowSidebar(true)} />;
        case '/announcements':
          return <Announcements onSidebarHide={() => onSetShowSidebar(true)} />;
        case '/about':
          return <About onSidebarHide={() => onSetShowSidebar(true)} />;
        case '/edit-resume':
          return <ResumeForm onSidebarHide={() => onSetShowSidebar(true)} />;
        case '/profile':
          return <ProfileSettings onSidebarHide={() => onSetShowSidebar(true)} />;
        case '/chat':
        case '/tasks':
        case '/reports':
          return <DashboardContent onSidebarHide={() => onSetShowSidebar(true)} />;
        default:
          return <DashboardContent onSidebarHide={() => onSetShowSidebar(true)} />;
      }
    })();

    // Only apply margin for settings pages, about page, and edit-resume page
    const isSettingsPage = currentPath === '/settings' || currentPath === '/profile' || currentPath === '/announcements' || currentPath === '/about' || currentPath === '/edit-resume';
    
    if (isSettingsPage) {
      return (
        <div className="flex-1 ml-0 sm:ml-20 xl:ml-60 overflow-hidden h-screen bg-gray-100">
          {content}
        </div>
      );
    }
    
    return content;
  };

  return (
    <div className="flex min-h-screen bg-brand-background">
      <Sidebar
        onSidebarHide={() => {
          onSetShowSidebar(false);
        }}
        showSidebar={showSidebar}
        selectedPage={selectedPage}
        onPageSelect={handlePageSelect}
        user={user}
        onLogout={handleLogout}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        navigate={navigate}
      />
      <div className="flex flex-col flex-1 min-h-screen">
        <div className="flex-1 flex flex-col">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ onSidebarHide, showSidebar, selectedPage, onPageSelect, user, onLogout, showUserMenu, setShowUserMenu, navigate }) {
  return (
    <div
      className={clsx(
        'fixed inset-y-0 left-0 bg-card w-full sm:w-20 xl:w-60 sm:flex flex-col z-10',
        showSidebar ? 'flex' : 'hidden',
      )}
      style={{ overflow: 'visible' }}
    >
      <div className="flex-shrink-0 overflow-hidden p-2">
        <div
          className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-top"
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <div className="w-full flex justify-center items-center">
            <img src="/favicon.png" alt="Logo" style={{ width: 100, height: 100, marginBottom: -10, marginTop: -10 }} />
          </div>
          <div className="flex-grow sm:hidden xl:block" />
          <IconButton
            icon="res-react-dash-sidebar-close"
            className="block sm:hidden"
            onClick={onSidebarHide}
          />
        </div>
      </div>
      <div className="flex-grow overflow-x-hidden overflow-y-auto flex flex-col">
        <div className="w-full p-3 h-24 sm:h-20 xl:h-24 hidden sm:block flex-shrink-0">
          <div className="bg-sidebar-card-top rounded-xl w-full h-full flex items-center justify-start sm:justify-center xl:justify-start px-3 sm:px-0 xl:px-3">
            {/* <Icon path="res-react-dash-sidebar-card" className="w-9 h-9 " /> */}
            <div className="bg-white rounded-2xl">
              <img src="/favicon.png" alt="Logo" style={{ width:75, height: 50}} />
            </div>
            <div className="block sm:hidden xl:block ml-3">
              <div className="text-sm font-bold white">الاتّحاد العام</div>
              <div className="text-sm">سيتم إضافة بقيّة الاتّحادات لاحقاً</div>
            </div>
            <div className="block sm:hidden xl:block flex-grow" />
            <Icon
              path="res-react-dash-sidebar-card-select"
              className="block sm:hidden xl:block w-5 h-5"
            />
          </div>
        </div>
        {sidebarItems[0].map((i) => (
          <MenuItem
            key={i.id}
            item={i}
            onClick={onPageSelect}
            selected={selectedPage}
          />
        ))}
        <div className="mt-8 mb-0 font-bold px-3 block sm:hidden xl:block">
          SHORTCUTS
        </div>
        {sidebarItems[1].map((i) => (
          <MenuItem
            key={i.id}
            item={i}
            onClick={onPageSelect}
            selected={selectedPage}
          />
        ))}
        <div className="flex-grow" />
      </div>

      <AttributionComponent />

      <div className="flex-shrink-0 p-2 relative user-menu-container">
        <div 
          className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-bottom cursor-pointer hover:bg-gray-700/50 rounded-lg transition-colors"
          onClick={() => {
            console.log('User menu clicked, current state:', showUserMenu);
            setShowUserMenu(!showUserMenu);
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="block sm:hidden xl:block ml-2">
            <div className="font-bold dashboard-username text-sm">{user?.name || 'User'}</div>
            <div className="text-xs dashboard-user-role">{user?.role || 'member'}</div>
          </div>
          <div className="flex-grow block sm:hidden xl:block" />
          <div className="block sm:hidden xl:block w-6 h-6 text-gray-400 hover:text-white transition-colors">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div 
            className="fixed bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-[1000] min-w-[280px]"
            style={{
              bottom: '80px',
              left: '8px',
              right: '8px',
              maxWidth: '280px'
            }}
          >
            {/* Authentication Status Section */}
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${user ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-white text-xs font-medium">
                  {user ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>
              {user && (
                <div className="text-xs text-gray-300 space-y-1">
                  <div>ID: {user.id}</div>
                  <div>Email: {user.email}</div>
                  <div>Active: {user.is_active ? 'Yes' : 'No'}</div>
                  <div>Verified: {user.is_verified ? 'Yes' : 'No'}</div>
                </div>
              )}
            </div>
            
            {/* User Info Section */}
            <div className="p-3 border-b border-gray-700">
              <div className="text-white font-medium text-sm">{user?.name}</div>
              <div className="text-gray-400 text-xs">{user?.email}</div>
              <div className="text-gray-400 text-xs capitalize">{user?.role || 'member'}</div>
            </div>
            
            {/* Menu Actions */}
            <div className="py-2">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/profile');
                }}
                className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function MenuItem({ item: { id, title, notifications }, onClick, selected }) {
  return (
    <div
      className={clsx(
        'w-full mt-6 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3 cursor-pointer',
        selected === id ? 'sidebar-item-selected' : 'sidebar-item',
      )}
      onClick={() => onClick(id)}
    >
      <SidebarIcons id={id} />
      <div className="block sm:hidden xl:block ml-2">{title}</div>
      <div className="block sm:hidden xl:block flex-grow" />
      {notifications && (
        <div className="flex sm:hidden xl:flex bg-pink-600  w-5 h-5 items-center justify-center rounded-full mr-2">
          <div className="text-white text-sm">{notifications}</div>
        </div>
      )}
    </div>
  );
}
function SidebarIcons({ id }) {
  const icons = {
    0: (
      <>
        <path d="M12 19C10.067 19 8.31704 18.2165 7.05029 16.9498L12 12V5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        />
      </>
    ),
    1: (
      <>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"
        />
      </>
    ),
    2: (
      <>
        <path d="M2 4V18L6.8 14.4C7.14582 14.1396 7.56713 13.9992 8 14H16C17.1046 14 18 13.1046 18 12V4C18 2.89543 17.1046 2 16 2H4C2.89543 2 2 2.89543 2 4ZM4 14V4H16V12H7.334C6.90107 11.9988 6.47964 12.1393 6.134 12.4L4 14Z" />
        <path d="M22 22V9C22 7.89543 21.1046 7 20 7V18L17.866 16.4C17.5204 16.1393 17.0989 15.9988 16.666 16H7C7 17.1046 7.89543 18 9 18H16C16.4329 17.9992 16.8542 18.1396 17.2 18.4L22 22Z" />
      </>
    ),
    3: (
      <>
        <path d="M9 3C6.23858 3 4 5.23858 4 8C4 10.7614 6.23858 13 9 13C11.7614 13 14 10.7614 14 8C14 5.23858 11.7614 3 9 3ZM6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8Z" />
        <path d="M16.9084 8.21828C16.6271 8.07484 16.3158 8.00006 16 8.00006V6.00006C16.6316 6.00006 17.2542 6.14956 17.8169 6.43645C17.8789 6.46805 17.9399 6.50121 18 6.5359C18.4854 6.81614 18.9072 7.19569 19.2373 7.65055C19.6083 8.16172 19.8529 8.75347 19.9512 9.37737C20.0496 10.0013 19.9987 10.6396 19.8029 11.2401C19.6071 11.8405 19.2719 12.3861 18.8247 12.8321C18.3775 13.2782 17.8311 13.6119 17.2301 13.8062C16.6953 13.979 16.1308 14.037 15.5735 13.9772C15.5046 13.9698 15.4357 13.9606 15.367 13.9496C14.7438 13.8497 14.1531 13.6038 13.6431 13.2319L13.6421 13.2311L14.821 11.6156C15.0761 11.8017 15.3717 11.9248 15.6835 11.9747C15.9953 12.0247 16.3145 12.0001 16.615 11.903C16.9155 11.8059 17.1887 11.639 17.4123 11.416C17.6359 11.193 17.8035 10.9202 17.9014 10.62C17.9993 10.3198 18.0247 10.0006 17.9756 9.68869C17.9264 9.37675 17.8041 9.08089 17.6186 8.82531C17.4331 8.56974 17.1898 8.36172 16.9084 8.21828Z" />
        <path d="M19.9981 21C19.9981 20.475 19.8947 19.9551 19.6938 19.47C19.4928 18.9849 19.1983 18.5442 18.8271 18.1729C18.4558 17.8017 18.0151 17.5072 17.53 17.3062C17.0449 17.1053 16.525 17.0019 16 17.0019V15C16.6821 15 17.3584 15.1163 18 15.3431C18.0996 15.3783 18.1983 15.4162 18.2961 15.4567C19.0241 15.7583 19.6855 16.2002 20.2426 16.7574C20.7998 17.3145 21.2417 17.9759 21.5433 18.7039C21.5838 18.8017 21.6217 18.9004 21.6569 19C21.8837 19.6416 22 20.3179 22 21H19.9981Z" />
        <path d="M16 21H14C14 18.2386 11.7614 16 9 16C6.23858 16 4 18.2386 4 21H2C2 17.134 5.13401 14 9 14C12.866 14 16 17.134 16 21Z" />
      </>
    ),
    4: (
      <>
        <path d="M19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H7V2H9V4H15V2H17V4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22ZM5 10V20H19V10H5ZM5 6V8H19V6H5ZM17 14H7V12H17V14Z" />
      </>
    ),
    5: (
      <>
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" />
        <path d="M8 12H16V14H8V12Z" />
        <path d="M8 16H13V18H8V16Z" />
      </>
    ),
    5: (
      <>
        <path d="M21.266 20.998H2.73301C2.37575 20.998 2.04563 20.8074 1.867 20.498C1.68837 20.1886 1.68838 19.8074 1.86701 19.498L11.133 3.49799C11.3118 3.1891 11.6416 2.9989 11.9985 2.9989C12.3554 2.9989 12.6852 3.1891 12.864 3.49799L22.13 19.498C22.3085 19.8072 22.3086 20.1882 22.1303 20.4975C21.9519 20.8069 21.6221 20.9976 21.265 20.998H21.266ZM12 5.99799L4.46901 18.998H19.533L12 5.99799ZM12.995 14.999H10.995V9.99799H12.995V14.999Z" />
        <path d="M11 16H13V18H11V16Z" />
      </>
    ),
    6: (
      <>
        <path d="M13.82 22H10.18C9.71016 22 9.3036 21.673 9.20304 21.214L8.79604 19.33C8.25309 19.0921 7.73827 18.7946 7.26104 18.443L5.42404 19.028C4.97604 19.1709 4.48903 18.9823 4.25404 18.575L2.43004 15.424C2.19763 15.0165 2.2777 14.5025 2.62304 14.185L4.04804 12.885C3.98324 12.2961 3.98324 11.7019 4.04804 11.113L2.62304 9.816C2.27719 9.49837 2.19709 8.98372 2.43004 8.576L4.25004 5.423C4.48503 5.0157 4.97204 4.82714 5.42004 4.97L7.25704 5.555C7.5011 5.37416 7.75517 5.20722 8.01804 5.055C8.27038 4.91269 8.53008 4.78385 8.79604 4.669L9.20404 2.787C9.30411 2.32797 9.71023 2.00049 10.18 2H13.82C14.2899 2.00049 14.696 2.32797 14.796 2.787L15.208 4.67C15.4888 4.79352 15.7623 4.93308 16.027 5.088C16.274 5.23081 16.5127 5.38739 16.742 5.557L18.58 4.972C19.0277 4.82967 19.5142 5.01816 19.749 5.425L21.569 8.578C21.8015 8.98548 21.7214 9.49951 21.376 9.817L19.951 11.117C20.0158 11.7059 20.0158 12.3001 19.951 12.889L21.376 14.189C21.7214 14.5065 21.8015 15.0205 21.569 15.428L19.749 18.581C19.5142 18.9878 19.0277 19.1763 18.58 19.034L16.742 18.449C16.5095 18.6203 16.2678 18.7789 16.018 18.924C15.7559 19.0759 15.4854 19.2131 15.208 19.335L14.796 21.214C14.6956 21.6726 14.2895 21.9996 13.82 22ZM7.62004 16.229L8.44004 16.829C8.62489 16.9652 8.81755 17.0904 9.01704 17.204C9.20474 17.3127 9.39801 17.4115 9.59604 17.5L10.529 17.909L10.986 20H13.016L13.473 17.908L14.406 17.499C14.8133 17.3194 15.1999 17.0961 15.559 16.833L16.38 16.233L18.421 16.883L19.436 15.125L17.853 13.682L17.965 12.67C18.0142 12.2274 18.0142 11.7806 17.965 11.338L17.853 10.326L19.437 8.88L18.421 7.121L16.38 7.771L15.559 7.171C15.1998 6.90671 14.8133 6.68175 14.406 6.5L13.473 6.091L13.016 4H10.986L10.527 6.092L9.59604 6.5C9.39785 6.58704 9.20456 6.68486 9.01704 6.793C8.81878 6.90633 8.62713 7.03086 8.44304 7.166L7.62204 7.766L5.58204 7.116L4.56504 8.88L6.14804 10.321L6.03604 11.334C5.98684 11.7766 5.98684 12.2234 6.03604 12.666L6.14804 13.678L4.56504 15.121L5.58004 16.879L7.62004 16.229ZM11.996 16C9.7869 16 7.99604 14.2091 7.99604 12C7.99604 9.79086 9.7869 8 11.996 8C14.2052 8 15.996 9.79086 15.996 12C15.9933 14.208 14.204 15.9972 11.996 16ZM11.996 10C10.9034 10.0011 10.0139 10.8788 9.99827 11.9713C9.98262 13.0638 10.8466 13.9667 11.9387 13.9991C13.0309 14.0315 13.9469 13.1815 13.996 12.09V12.49V12C13.996 10.8954 13.1006 10 11.996 10Z" />
      </>
    ),
    7: (
      <>
        <path d="M21 11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1L21 5V11ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 17.25C18 15.18 15.58 13.53 12 13.53S6 15.18 6 17.25V18H18V17.25Z" />
      </>
    ),
  };
  return (
    <svg
      className="w-8 h-8 xl:w-5 xl:h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {icons[id]}
    </svg>
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

export default DashboardApp;