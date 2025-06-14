import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
  localStorage.setItem('token', token);
  setToken(token);
  axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    .then(res => setUser(res.data))
    .catch(() => setUser(null));
};

const logout = () => {
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);
};


  return (
    <UserContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
