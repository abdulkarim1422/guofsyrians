import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.tsx';
import UserSettings from './UserSettings.jsx';
import AdminSettings from './AdminSettings.jsx';
import { isAdmin } from '@/utils/userUtils.js';

const Settings = ({ onSidebarHide }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('user');

  // Auto-set to admin view if user is admin and no navigation has been shown yet
  useEffect(() => {
    if (isAdmin(user) && activeView === 'user') {
      setActiveView('admin');
    }
  }, [user, activeView]);

  const userIsAdmin = isAdmin(user);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      {userIsAdmin && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8" aria-label="Settings">
              <button
                onClick={() => setActiveView('user')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'user'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Settings
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'admin'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Admin Settings
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'user' ? (
          <UserSettings onSidebarHide={onSidebarHide} />
        ) : userIsAdmin ? (
          <AdminSettings onSidebarHide={onSidebarHide} />
        ) : (
          <UserSettings onSidebarHide={onSidebarHide} />
        )}
      </div>
    </div>
  );
};

export default Settings;
