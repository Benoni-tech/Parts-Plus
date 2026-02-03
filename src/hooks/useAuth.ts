// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../Contexts/authContexts';
import { AuthContextType } from '../types/auth.types';

/**
 * Custom hook to use auth context
 * Throws error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};