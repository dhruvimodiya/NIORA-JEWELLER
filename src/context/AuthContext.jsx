import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

// create contect here
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'INIT':
      return action.payload;
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
// store data in localstorage check storage.js file
  useEffect(() => {
    const savedAuth = storage.get('auth');
    if (savedAuth) {
      dispatch({ type: 'INIT', payload: savedAuth });
    }
  }, []);

  const login = (email, password) => {
    // Mock authentication
    if (email && password) {
      const mockUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      const authData = {
        isAuthenticated: true,
        user: mockUser,
        token: mockToken,
      };
      
      dispatch({ type: 'LOGIN', payload: authData });
      storage.set('auth', authData);
      toast.success(`Welcome back, ${mockUser.name}!`);
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const signup = (name, email, password) => {
    // Mock signup
    if (name && email && password) {
      const mockUser = {
        id: Date.now(),
        name: name,
        email: email,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      const authData = {
        isAuthenticated: true,
        user: mockUser,
        token: mockToken,
      };
      
      dispatch({ type: 'LOGIN', payload: authData });
      storage.set('auth', authData);
      toast.success(`Account created! Welcome, ${name}!`);
      return true;
    }
    toast.error('Please fill all fields');
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    storage.remove('auth');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
