import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'staff' | 'admin';
  department: string;
  isActive: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
  consentGiven: boolean;
  lastSeen: Date;
}

interface UserContextType {
  users: User[];
  currentUser: User | null;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  getUserById: (userId: string) => User | undefined;
  getUsersByRole: (role: string) => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      role: 'student',
      department: 'Computer Science',
      isActive: true,
      privacyLevel: 'public',
      consentGiven: true,
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Prof. Robert Smith',
      email: 'r.smith@university.edu',
      role: 'teacher',
      department: 'Physics',
      isActive: true,
      privacyLevel: 'friends',
      consentGiven: true,
      lastSeen: new Date()
    },
    {
      id: 'admin-1',
      name: 'Campus Admin',
      email: 'admin@university.edu',
      role: 'admin',
      department: 'Administration',
      isActive: true,
      privacyLevel: 'private',
      consentGiven: true,
      lastSeen: new Date()
    }
  ]);

  const [currentUser] = useState<User>(users.find(u => u.role === 'admin') || users[0]);

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getUsersByRole = (role: string) => {
    return users.filter(user => user.role === role);
  };

  const value: UserContextType = {
    users,
    currentUser,
    addUser,
    updateUser,
    removeUser,
    getUserById,
    getUsersByRole
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};