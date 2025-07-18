import  React ,{ createContext, useContext, useState, useEffect, Children} from 'react';
 export const AuthContext = createContext();

 export const AuthProvider = ({children}) => {
    cons [User, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.access_token) {
            setUser(storedUser);
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

    return (
        <AuthContext.Provider value= {{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

 }
 export const useAuth = () => useContext(AuthContext);