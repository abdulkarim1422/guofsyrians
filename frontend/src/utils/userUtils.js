// Utility functions for user role checking
export const isAdmin = (user) => {
  console.log('Checking admin status for user:', user);
  console.log('User role:', user?.role);
  console.log('Role type:', typeof user?.role);
  
  return user?.role === 'admin';
};

export const hasRole = (user, role) => {
  return user?.role === role;
};

export const canAccessAdminFeatures = (user) => {
  return isAdmin(user);
};
