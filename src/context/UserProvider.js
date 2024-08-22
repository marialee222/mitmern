import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setCurrentUser({ ...storedUser, token: storedToken });
    }
  }, []);

  const handleRegister = async (userData, stayOnPage = false) => {
    try {
      const response = await registerUser(userData);
      const { user, token } = response;
      setCurrentUser({ ...user, token });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      if (!stayOnPage) {
        navigate('/'); // Redirect to home or dashboard after registration only if stayOnPage is false
      }
      return true;
    } catch (error) {
      console.error('Registration failed:', error.message);
      return false;
    }
  };

  const handleLogin = async (userData) => {
    try {
      const response = await loginUser(userData);
      const { user, token } = response;
      setCurrentUser({ ...user, token });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate('/'); // Redirect to home or dashboard after login
      return true;
    } catch (error) {
      console.error('Login failed:', error.message);
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ currentUser, handleRegister, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
