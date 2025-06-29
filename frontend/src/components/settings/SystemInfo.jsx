import { useState, useEffect } from 'react';

const SystemInfo = () => {
  const [systemInfo] = useState({
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    buildDate: new Date().toISOString().split('T')[0],
    apiStatus: 'Connected',
    uptime: '24 hours'
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mt-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          System Information
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Application and system status overview.
        </p>
      </div>
      <div className="p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Application Version</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{systemInfo.version}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                systemInfo.environment === 'production' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {systemInfo.environment}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Build Date</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{systemInfo.buildDate}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">API Status</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {systemInfo.apiStatus}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{systemInfo.uptime}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SystemInfo;
