import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserInfo from './UserInfo';
import LogoutButton from './LogoutButton';

const AuthTest = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
          <span className="text-white">Loading authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Authentication Status</h2>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-white">
              Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          
          {isAuthenticated && user && (
            <>
              <div className="text-sm text-gray-300">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Active:</strong> {user.is_active ? 'Yes' : 'No'}</p>
                <p><strong>Verified:</strong> {user.is_verified ? 'Yes' : 'No'}</p>
              </div>
              
              <div className="pt-4">
                <LogoutButton className="w-full" />
              </div>
            </>
          )}
        </div>
      </div>
      
      {isAuthenticated && user && (
        <UserInfo />
      )}
    </div>
  );
};

export default AuthTest;
