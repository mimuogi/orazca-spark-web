import { useMemo } from 'react';

export default function useAuth() {
  const token = useMemo(() => localStorage.getItem('token'), []);

  return {
    token,
    isAuthenticated: Boolean(token)
  };
}
