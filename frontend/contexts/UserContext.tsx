'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'user';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');

  const value = {
    role,
    setRole,
    isAdmin: role === 'admin',
    isUser: role === 'user',
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}