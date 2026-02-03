// src/hooks/useEmailVerification.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface UseEmailVerificationReturn {
  isVerified: boolean;
  isChecking: boolean;
  checkVerification: () => Promise<boolean>;
  error: string | null;
}

/**
 * Custom hook to manage email verification status
 * Can poll for verification status at intervals
 */
export const useEmailVerification = (
  pollInterval?: number
): UseEmailVerificationReturn => {
  const { user, checkEmailVerified } = useAuth();
  const [isVerified, setIsVerified] = useState(user?.emailVerified || false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update verified state when user changes
  useEffect(() => {
    setIsVerified(user?.emailVerified || false);
  }, [user?.emailVerified]);

  /**
   * Check verification status
   */
  const checkVerification = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('No user signed in');
      return false;
    }

    try {
      setIsChecking(true);
      setError(null);
      const verified = await checkEmailVerified();
      setIsVerified(verified);
      return verified;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [user, checkEmailVerified]);

  // Poll for verification if interval is provided
  useEffect(() => {
    if (!pollInterval || isVerified || !user) {
      return;
    }

    const interval = setInterval(() => {
      checkVerification();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval, isVerified, user, checkVerification]);

  return {
    isVerified,
    isChecking,
    checkVerification,
    error,
  };
};