import  React ,{ createContext, useContext, useState, useEffect, useMemo} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.access_token) {
      try {
        const tokenPayload = JSON.parse(atob(storedUser.access_token.split('.')[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();

        if (!isExpired) {
          setUser(storedUser);
        } else {
          localStorage.removeItem('user');
        }
      } catch {
        // handle malformed token
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
