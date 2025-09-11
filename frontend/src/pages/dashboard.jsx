// C:\Users\abodi\OneDrive\Desktop\guofsyrians-main\frontend\src\pages\dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import '@/styles/dashboard.css';
import DashboardContent from '@/components/dashboard-components/dashboard.jsx';
import StudentsList from '@/components/dashboard-components/StudentsList.jsx';
import Settings from '@/components/settings/Settings.jsx';
import ProfileSettings from '@/components/settings/ProfileSettings.jsx';
import Announcements from '@/components/announcements/Announcements.jsx';
import AdminNewJob from '@/pages/AdminNewJob.jsx';
import AdminApplications from '@/pages/AdminApplications.jsx';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { AttributionComponent } from '@/components/dashboard-components/attribution.jsx';
import About from '@/pages/about.jsx';
import { ResumeForm } from '@/pages/ResumeForm.jsx';

// Centralized route and menu configuration
const MENU_ITEMS = {
  0: { 
    id: '0', 
    title: 'Dashboard', 
    path: '/dashboard', 
    alternativePaths: ['/'], 
    component: 'DashboardContent',
    icon: (<><path d="M12 19C10.067 19 8.31704 18.2165 7.05029 16.9498L12 12V5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z" /><path fillRule="evenodd" clipRule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" /></>),
    notifications: false,
    adminOnly: false,
    group: 0
  },
  1: { 
    id: '1', 
    title: 'Students list', 
    path: '/students-list', 
    component: 'StudentsList',
    icon: (<><path fillRule="evenodd" clipRule="evenodd" d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z" /></>),
    notifications: false,
    adminOnly: true,
    group: 0
  },
  5: { 
    id: '5', 
    title: 'Edit Resume', 
    path: '/edit-resume', 
    component: 'ResumeForm',
    icon: (<><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" /><path d="M8 12H16V14H8V12Z" /><path d="M8 16H13V18H8V16Z" /></>),
    notifications: false,
    adminOnly: false,
    group: 0
  },
  6: { 
    id: '6', 
    title: 'إضافة وظيفة', 
    path: '/admin/jobs/new', 
    component: 'AdminNewJob',
    icon: (<><path d="M10 4h4a2 2 0 012 2v1h2.5A1.5 1.5 0 0120 8.5v9A1.5 1.5 0 0118.5 19h-13A1.5 1.5 0 014 17.5v-9A1.5 1.5 0 015.5 6H8V6a2 2 0 012-2zm0 2v1h4V6h-4z" /></>),
    notifications: false,
    adminOnly: true,
    group: 0
  },
  7: { 
    id: '7', 
    title: 'إدارة الطلبات', 
    path: '/admin/applications', 
    component: 'AdminApplications',
    icon: (<><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></>),
    notifications: false,
    adminOnly: true,
    group: 0
  },
  2: { 
    id: '2', 
    title: 'Settings', 
    path: '/settings', 
    component: 'Settings',
    icon: (<><path d="M2 4V18L6.8 14.4C7.14582 14.1396 7.56713 13.9992 8 14H16C17.1046 14 18 13.1046 18 12V4C18 2.89543 17.1046 2 16 2H4C2.89543 2 2 2.89543 2 4ZM4 14V4H16V12H7.334C6.90107 11.9988 6.47964 12.1393 6.134 12.4L4 14Z" /><path d="M22 22V9C22 7.89543 21.1046 7 20 7V18L17.866 16.4C17.5204 16.1393 17.0989 15.9988 16.666 16H7C7 17.1046 7.89543 18 9 18H16C16.4329 17.9992 16.8542 18.1396 17.2 18.4L22 22Z" /></>),
    notifications: false,
    adminOnly: false,
    group: 1
  },
  3: { 
    id: '3', 
    title: 'Announcements', 
    path: '/announcements', 
    component: 'Announcements',
    icon: (<><path d="M9 3C6.23858 3 4 5.23858 4 8C4 10.7614 6.23858 13 9 13C11.7614 13 14 10.7614 14 8C14 5.23858 11.7614 3 9 3ZM6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8Z" /><path d="M16.9084 8.21828C16.6271 8.07484 16.3158 8.00006 16 8.00006V6.00006C16.6316 6.00006 17.2542 6.14956 17.8169 6.43645C17.8789 6.46805 17.9399 6.50121 18 6.5359C18.4854 6.81614 18.9072 7.19569 19.2373 7.65055C19.6083 8.16172 19.8529 8.75347 19.9512 9.37737C20.0496 10.0013 19.9987 10.6396 19.8029 11.2401C19.6071 11.8405 19.2719 12.3861 18.8247 12.8321C18.3775 13.2782 17.8311 13.6119 17.2301 13.8062C16.6953 13.979 16.1308 14.037 15.5735 13.9772C15.5046 13.9698 15.4357 13.9606 15.367 13.9496C14.7438 13.8497 14.1531 13.6038 13.6431 13.2319L13.6421 13.2311L14.821 11.6156C15.0761 11.8017 15.3717 11.9248 15.6835 11.9747C15.9953 12.0247 16.3145 12.0001 16.615 11.903C16.9155 11.8059 17.1887 11.639 17.4123 11.416C17.6359 11.193 17.8035 10.9202 17.9014 10.62C17.9993 10.3198 18.0247 10.0006 17.9756 9.68869C17.9264 9.37675 17.8041 9.08089 17.6186 8.82531C17.4331 8.56974 17.1898 8.36172 16.9084 8.21828Z" /><path d="M19.9981 21C19.9981 20.475 19.8947 19.9551 19.6938 19.47C19.4928 18.9849 19.1983 18.5442 18.8271 18.1729C18.4558 17.8017 18.0151 17.5072 17.53 17.3062C17.0449 17.1053 16.525 17.0019 16 17.0019V15C16.6821 15 17.3584 15.1163 18 15.3431C18.0996 15.3783 18.1983 15.4162 18.2961 15.4567C19.0241 15.7583 19.6855 16.2002 20.2426 16.7574C20.7998 17.3145 21.2417 17.9759 21.5433 18.7039C21.5838 18.8017 21.6217 18.9004 21.6569 19C21.8837 19.6416 22 20.3179 22 21H19.9981Z" /><path d="M16 21H14C14 18.2386 11.7614 16 9 16C6.23858 16 4 18.2386 4 21H2C2 17.134 5.13401 14 9 14C12.866 14 16 17.134 16 21Z" /></>),
    notifications: false,
    adminOnly: false,
    group: 1
  },
  4: { 
    id: '4', 
    title: 'About', 
    path: '/about', 
    component: 'About',
    icon: (<><path d="M19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H7V2H9V4H15V2H17V4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22ZM5 10V20H19V10H5ZM5 6V8H19V6H5ZM17 14H7V12H17V14Z" /></>),
    notifications: false,
    adminOnly: false,
    group: 1
  },
  profile: { 
    id: 'profile', 
    title: 'Profile', 
    path: '/profile', 
    component: 'ProfileSettings',
    icon: (<><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></>),
    notifications: false,
    adminOnly: false,
    group: -1 // Special group for non-sidebar items
  }
};

const getSidebarItems = (userRole) => {
  const items = Object.values(MENU_ITEMS)
    .filter(item => item.group >= 0) // Only include sidebar items
    .filter(item => !item.adminOnly || userRole === 'admin'); // Filter admin-only items

  const group0 = items.filter(item => item.group === 0);
  const group1 = items.filter(item => item.group === 1);
  
  return [group0, group1];
};

const getMenuItemByPath = (pathname) => {
  return Object.values(MENU_ITEMS).find(item => 
    item.path === pathname || 
    (item.alternativePaths && item.alternativePaths.includes(pathname))
  );
};

const DashboardApp = () => {
  const [showSidebar, onSetShowSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  useEffect(() => {
    document.body.className = 'dashboard-body';
    return () => { document.body.className = ''; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, setShowUserMenu]);

  const getSelectedPageFromPath = (pathname) => {
    const menuItem = getMenuItemByPath(pathname);
    return menuItem ? menuItem.id : '0'; // Default to dashboard
  };

  const selectedPage = getSelectedPageFromPath(location.pathname);
  const sidebarItems = getSidebarItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePageSelect = (pageId) => {
    const menuItem = MENU_ITEMS[pageId];
    if (menuItem) {
      navigate(menuItem.path);
    } else {
      navigate('/dashboard');
    }
  };

  const renderCurrentPage = () => {
    const currentPath = location.pathname;
    const menuItem = getMenuItemByPath(currentPath);
    
    const getComponent = (componentName) => {
      const onSidebarHide = () => onSetShowSidebar(true);
      
      switch (componentName) {
        case 'DashboardContent':
          return <DashboardContent onSidebarHide={onSidebarHide} />;
        case 'StudentsList':
          return <StudentsList onSidebarHide={onSidebarHide} />;
        case 'Settings':
          return <Settings onSidebarHide={onSidebarHide} />;
        case 'Announcements':
          return <Announcements onSidebarHide={onSidebarHide} />;
        case 'About':
          return <About onSidebarHide={onSidebarHide} />;
        case 'ResumeForm':
          return <ResumeForm onSidebarHide={onSidebarHide} />;
        case 'AdminNewJob':
          return <AdminNewJob onSidebarHide={onSidebarHide} />;
        case 'AdminApplications':
          return <AdminApplications />;
        case 'ProfileSettings':
          return <ProfileSettings onSidebarHide={onSidebarHide} />;
        default:
          return <DashboardContent onSidebarHide={onSidebarHide} />;
      }
    };

    // Handle special cases for legacy routes
    if (['/chat', '/tasks', '/reports'].includes(currentPath)) {
      return <DashboardContent onSidebarHide={() => onSetShowSidebar(true)} />;
    }

    const content = menuItem ? 
      getComponent(menuItem.component) : 
      <DashboardContent onSidebarHide={() => onSetShowSidebar(true)} />;

    // Check if current page should use settings layout
    const settingsPageIds = ['2', '3', '4', '5', '6', 'profile'];
    const isSettingsPage = menuItem && settingsPageIds.includes(menuItem.id);

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
        onSidebarHide={() => { onSetShowSidebar(false); }}
        showSidebar={showSidebar}
        selectedPage={selectedPage}
        onPageSelect={handlePageSelect}
        user={user}
        onLogout={handleLogout}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        navigate={navigate}
        sidebarItems={sidebarItems}
      />
      <div className="flex flex-col flex-1 min-h-screen">
        <div className="flex-1 flex flex-col">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  onSidebarHide, showSidebar, selectedPage, onPageSelect,
  user, onLogout, showUserMenu, setShowUserMenu, navigate, sidebarItems
}) {
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
            <img src="/favicon.png" alt="Logo"
                 style={{ width: 100, height: 100, marginBottom: -10, marginTop: -10 }} />
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
            <div className="bg-white rounded-2xl">
              <img src="/favicon.png" alt="Logo" style={{ width: 75, height: 50 }} />
            </div>
            <div className="block sm:hidden xl:block ml-3">
              <div className="text-sm font-bold white">الاتّحاد العام</div>
              <div className="text-sm">سيتم إضافة بقيّة الاتّحادات لاحقاً</div>
            </div>
            <div className="block sm:hidden xl:block flex-grow" />
            <Icon path="res-react-dash-sidebar-card-select" className="block sm:hidden xl:block w-5 h-5" />
          </div>
        </div>

        {sidebarItems[0].map((i) => (
          <MenuItem key={i.id} item={i} onClick={onPageSelect} selected={selectedPage} />
        ))}

        <div className="mt-8 mb-0 font-bold px-3 block sm:hidden xl:block">
          SHORTCUTS
        </div>

        {sidebarItems[1].map((i) => (
          <MenuItem key={i.id} item={i} onClick={onPageSelect} selected={selectedPage} />
        ))}

        <div className="flex-grow" />
      </div>

      <AttributionComponent />

      <div className="flex-shrink-0 p-2 relative user-menu-container">
        <div
          className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-bottom cursor-pointer hover:bg-gray-700/50 rounded-lg transition-colors"
          onClick={() => setShowUserMenu(!showUserMenu)}
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

        {showUserMenu && (
          <div
            className="fixed bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-[1000] min-w-[280px]"
            style={{ bottom: '80px', left: '8px', right: '8px', maxWidth: '280px' }}
          >
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${user ? 'bg-green-400' : 'bg-red-400'}`} />
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
            <div className="p-3 border-b border-gray-700">
              <div className="text-white font-medium text-sm">{user?.name}</div>
              <div className="text-gray-400 text-xs">{user?.email}</div>
              <div className="text-gray-400 text-xs capitalize">{user?.role || 'member'}</div>
            </div>
            <div className="py-2">
              <button
                onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                onClick={() => { setShowUserMenu(false); onLogout(); }}
                className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

function MenuItem({ item: { id, title, notifications, icon }, onClick, selected }) {
  return (
    <div
      className={clsx(
        'w-full mt-6 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3 cursor-pointer',
        selected === id ? 'sidebar-item-selected' : 'sidebar-item',
      )}
      onClick={() => onClick(id)}
    >
      <svg className="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor">
        {icon}
      </svg>
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

function Icon({ path = 'options', className = 'w-4 h-4' }) {
  return (
    <img src={`https://assets.codepen.io/3685267/${path}.svg`} alt="" className={clsx(className)} />
  );
}

function IconButton({ onClick = () => {}, icon = 'options', className = 'w-4 h-4' }) {
  return (
    <button onClick={onClick} type="button" className={className}>
      <img src={`https://assets.codepen.io/3685267/${icon}.svg`} alt="" className="w-full h-full" />
    </button>
  );
}

function Image({ path = '1', className = 'w-4 h-4' }) {
  return (
    <img src={`https://assets.codepen.io/3685267/${path}.jpg`} alt="" className={clsx(className, 'rounded-full')} />
  );
}

export default DashboardApp;
