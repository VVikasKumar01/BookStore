import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, userInfo: action.payload, loading: false };
        case 'LOGOUT':
            return { ...state, userInfo: null, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        userInfo: null,
        loading: true,
    });

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            dispatch({ type: 'LOGIN', payload: JSON.parse(userInfo) });
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        dispatch({ type: 'LOGIN', payload: userData });
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
