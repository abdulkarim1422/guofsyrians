// Mobile debugging utilities
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    isMobile: isMobile(),
    isOnline: navigator.onLine,
    connectionType: navigator.connection?.effectiveType || 'unknown',
    url: window.location.href,
    origin: window.location.origin
  };
};

export const debugAPI = async (url) => {
  console.log('=== API Debug Info ===');
  console.log('Device Info:', getDeviceInfo());
  console.log('Attempting to connect to:', url);
  
  try {
    const response = await fetch(url + '/health');
    console.log('Health check response:', response.status, response.statusText);
    const data = await response.json();
    console.log('Health check data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, error: error.message };
  }
};

export const logNetworkError = (error) => {
  console.error('=== Network Error Debug ===');
  console.log('Device Info:', getDeviceInfo());
  console.error('Error:', error);
  
  if (error.code === 'NETWORK_ERROR') {
    console.log('Possible causes:');
    console.log('1. Server is down');
    console.log('2. CORS issues');
    console.log('3. DNS resolution problems');
    console.log('4. Network connectivity issues');
  }
};
