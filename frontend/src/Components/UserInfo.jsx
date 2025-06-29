import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserInfo = ({ className = '', showEmail = true, showRole = true }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'member':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className={`bg-white/5 rounded-lg p-4 border border-white/10 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold">{user.name}</h3>
            {showRole && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            )}
          </div>
          {showEmail && (
            <p className="text-gray-400 text-sm">{user.email}</p>
          )}
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs text-gray-400">
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${user.is_verified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-xs text-gray-400">
                {user.is_verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
