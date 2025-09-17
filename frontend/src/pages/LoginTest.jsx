import React, { useState } from 'react';
import { authAPI } from '@/utils/api.js';
import { useAuth } from '@/contexts/AuthContext';

export const LoginTest = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();

  const testLogin = async () => {
    setLoading(true);
    try {
      const result = await authAPI.login({
        email: 'test@example.com',
        password: 'test123'
      });
      
      // Use the auth context to login
      login(result.access_token, result.user);
      
      setResponse(`Login Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Login test error:', error);
      setResponse(`Error: ${error.message}\nDetails: ${JSON.stringify(error.response?.data || 'No response data', null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = async () => {
    setLoading(true);
    try {
      const result = await authAPI.login({
        email: 'admin@guofsyrians.com',
        password: 'admin123'
      });
      
      // Use the auth context to login
      login(result.access_token, result.user);
      
      setResponse(`Admin Login Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Admin login test error:', error);
      setResponse(`Error: ${error.message}\nDetails: ${JSON.stringify(error.response?.data || 'No response data', null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Login API Test</h2>
      
      <div className="space-x-4 mb-4">
        <button 
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test User Login'}
        </button>
        
        <button 
          onClick={testAdminLogin}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
      </div>
      
      {isAuthenticated && (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <h3 className="font-semibold text-green-800">Authenticated!</h3>
          <p>User: {user?.name} ({user?.email})</p>
          <p>Role: {user?.role}</p>
          <a href="/form" className="text-blue-600 hover:underline">Go to Resume Form</a>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="font-semibold">Environment Check:</h3>
        <p>DEV Mode: {import.meta.env.DEV ? 'true' : 'false'}</p>
        <p>API URL: {import.meta.env.VITE_API_URL || 'not set'}</p>
        <p>Auth URL: {import.meta.env.VITE_API_URL_FOR_AUTH || 'not set'}</p>
      </div>
      
      {response && (
        <div className="mt-4">
          <h3 className="font-semibold">Response:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
};
