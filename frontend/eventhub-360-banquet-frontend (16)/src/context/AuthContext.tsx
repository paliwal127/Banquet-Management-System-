import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLE_PERMISSIONS } from '../constants/banquet';
import { showToast } from '../components/Feedback/ToastAlerts';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  role: string;
  jwtToken: string | null;
  hasPermission: (permission: string) => boolean;
  switchRole: (newRole: string) => void;
  login: (username: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('eh_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState<string>(() => {
    return localStorage.getItem('eh_role') || '';
  });
  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    return localStorage.getItem('eh_jwt_token');
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eh_jwt_token') {
        if (!e.newValue) {
          setUser(null);
          setRole('');
          setJwtToken(null);
        } else {
          const storedUser = localStorage.getItem('eh_user');
          setUser(storedUser ? JSON.parse(storedUser) : null);
          setRole(localStorage.getItem('eh_role') || '');
          setJwtToken(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  };

  const switchRole = (newRole: string) => {
    if (ROLE_PERMISSIONS[newRole]) {
      setRole(newRole);
      localStorage.setItem('eh_role', newRole);
      setUser(prev => {
        const updated = prev ? { ...prev, role: newRole } : null;
        if (updated) {
          localStorage.setItem('eh_user', JSON.stringify(updated));
        }
        return updated;
      });
      showToast.info(`Switched role context to ${newRole}`);
      
      // Log audit action dynamically in session storage
      const sessionLogs = JSON.parse(sessionStorage.getItem('session_audit_logs') || '[]');
      const newLog = {
        id: `sess-${Date.now()}`,
        actor: user?.username || 'Alex Johnson',
        role: newRole,
        action: 'Switched Role',
        resourceType: 'Auth',
        resourceId: 'auth-session',
        details: `Switched active role to ${newRole}`,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('session_audit_logs', JSON.stringify([newLog, ...sessionLogs]));
      window.dispatchEvent(new Event('storage'));
    } else {
      showToast.error(`Role ${newRole} does not have valid configuration.`);
    }
  };

  const login = (username: string, chosenRole: string) => {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ username, role: chosenRole }))}`;
    localStorage.setItem('eh_user', JSON.stringify({ username, role: chosenRole }));
    localStorage.setItem('eh_role', chosenRole);
    localStorage.setItem('eh_jwt_token', token);
    
    setUser({ username, role: chosenRole });
    setRole(chosenRole);
    setJwtToken(token);
    showToast.success(`Welcome, ${username}! Signed in as ${chosenRole}.`);
  };

  const logout = () => {
    localStorage.removeItem('eh_user');
    localStorage.removeItem('eh_role');
    localStorage.removeItem('eh_jwt_token');
    sessionStorage.removeItem('session_audit_logs');
    
    setUser(null);
    setRole('');
    setJwtToken(null);
    showToast.info('Signed out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, role, jwtToken, hasPermission, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
