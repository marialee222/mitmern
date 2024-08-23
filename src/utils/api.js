import axios from 'axios';

const API_URL = 'https://mitmern.herokuapp.com/api';

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error.message;
    }
};

// Login an existing user
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.msg || 'Login failed' : 'Server error');
    }
};

// Fetch all users (for admin use)
export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw new Error(error.response ? error.response.data.msg || 'Failed to fetch users' : 'Server error');
    }
};
