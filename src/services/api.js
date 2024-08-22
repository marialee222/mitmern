import axios from 'axios';

const API_URL = 'https://mitmern.herokuapp.com/api';


// Register a new user
export const registerUser = async (userData) => {
    try {
        console.log('Registering user with data:', userData);
        const response = await axios.post(`${API_URL}/users/register`, {
            ...userData,
            accountType: ['checking', 'savings'], // Or whatever account types are selected
        });
        console.log('Register response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error.response?.data || error.message;
    }
};

// Login an existing user
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.msg || 'Login failed' : 'Server error');
    }
};

// Fetch all users with account details in one request
export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw new Error(error.response ? error.response.data.msg || 'Failed to fetch users' : 'Server error');
    }
};

// Fetch user details by ID (including accounts and transactions)
export const getUserDetails = async (token, userId) => {
    console.log('Fetching details for user ID:', userId);

    try {
        if (!userId) {
            throw new Error('User ID is undefined');
        }
        const response = await axios.get(`${API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('User Details Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting user details:', error.message);
        throw new Error(error.response ? error.response.data.msg || 'Failed to fetch user details' : 'Server error');
    }
};

// Create a new account
export const createAccount = async ({ userId, accountType, token }) => {
    try {
        const response = await axios.post(`${API_URL}/accounts`, 
            { userId, accountType }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating account:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : error.message;
    }
};

// Update account balance
export const updateAccountBalance = async (token, accountId, newBalance) => {
    try {
        const response = await axios.patch(`${API_URL}/accounts/${accountId}/balance`, 
        { balance: newBalance }, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating account balance:', error);
        throw new Error('Failed to update account balance');
    }
};

// Get accounts for a user
export const getUserAccounts = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/accounts`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache', 
                'Pragma': 'no-cache', 
                'Expires': '0'
            }
        });
        console.log('Get user accounts response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting user accounts:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.msg || 'Failed to fetch accounts' : 'Server error');
    }
};

// Create a transaction (deposit/withdraw)
export const createTransaction = async (token, transactionData) => {
    try {
        const response = await axios.post(`${API_URL}/transactions`, transactionData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache', 
                'Pragma': 'no-cache', 
                'Expires': '0'
            }
        });
        console.log('Create transaction response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating transaction:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.msg || 'Transaction failed' : 'Server error');
    }
};

// Get transactions for a specific account
export const getAccountTransactions = async (token, accountId) => {
    try {
        const response = await axios.get(`${API_URL}/transactions/${accountId}`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache', 
                'Pragma': 'no-cache', 
                'Expires': '0'
            }
        });
        console.log('Get account transactions response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting account transactions:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.msg || 'Failed to fetch transactions' : 'Server error');
    }
};

// Transfer funds between accounts
export const transferFunds = async (token, sourceAccount, destinationAccount, amount) => {
    try {
        const response = await axios.post(
            `${API_URL}/accounts/transfer`, // Ensure this is the correct endpoint
            { sourceAccountId: sourceAccount, destinationAccountId: destinationAccount, amount }, // Adjust keys if necessary
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Transfer Funds Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error transferring funds:', error.message);
        throw new Error(error.response ? error.response.data.msg || 'Transfer failed' : 'Server error');
    }
};

// Update user details
export const updateUserDetails = async (token, userId, updatedData) => {
    try {
        const response = await axios.patch(`${API_URL}/users/${userId}`, updatedData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log('Update user details response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating user details:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.msg || 'Failed to update user details' : 'Server error');
    }
};
