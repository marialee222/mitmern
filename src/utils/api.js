// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};
