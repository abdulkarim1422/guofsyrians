import { useAuth } from '@/contexts/AuthContext.tsx';

const AuthDebugger = () => {
  const { user, token, isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
      <h4 className="font-bold mb-2">Auth Debug Info:</h4>
      <div><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
      <div><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</div>
      <div><strong>User:</strong> {user ? 'Loaded' : 'Not loaded'}</div>
      {user && (
        <div className="mt-2">
          <div><strong>ID:</strong> {user.id || 'No ID'}</div>
          <div><strong>Email:</strong> {user.email || 'No email'}</div>
          <div><strong>Name:</strong> {user.name || 'No name'}</div>
          <div><strong>Role:</strong> "{user.role}" (type: {typeof user.role})</div>
          <div><strong>Is Active:</strong> {user.is_active ? 'Yes' : 'No'}</div>
          <div><strong>Is Verified:</strong> {user.is_verified ? 'Yes' : 'No'}</div>
          <div><strong>Raw User Object:</strong></div>
          <pre className="mt-1 text-xs overflow-auto max-h-32 bg-white p-2 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;
