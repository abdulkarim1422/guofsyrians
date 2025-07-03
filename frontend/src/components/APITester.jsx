import React, { useState, useEffect } from 'react';
import { debugAPI } from '../utils/debugUtils';

const APITester = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAPITest = async () => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL_FOR_AUTH || 
                   import.meta.env.VITE_API_URL || 
                   'https://app-backend2.guofsyrians.org';
    
    const result = await debugAPI(apiUrl);
    setTestResults(result);
    setLoading(false);
  };

  useEffect(() => {
    runAPITest();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h4>API Connection Test</h4>
      <button onClick={runAPITest} disabled={loading}>
        {loading ? 'Testing...' : 'Test API'}
      </button>
      {testResults && (
        <div style={{ marginTop: '10px' }}>
          <strong>Status:</strong> {testResults.success ? '✅ Connected' : '❌ Failed'}
          <br />
          {testResults.success && testResults.data && (
            <div>
              <strong>Message:</strong> {testResults.data.message}
              <br />
              <strong>CORS Origins:</strong> {testResults.data.cors_origins?.join(', ')}
            </div>
          )}
          {!testResults.success && (
            <div>
              <strong>Error:</strong> {testResults.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APITester;
