// src/components/UserProfile.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserAccounts } from '../services/api';
import { useUser } from '../context/UserProvider';

const UserProfile = () => {
  const { userId } = useParams();
  const { currentUser } = useUser();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data by ID if needed (not shown here)
        
        // Fetch user accounts
        if (currentUser && currentUser.token) {
          const accountData = await getUserAccounts(currentUser.token);
          setAccounts(accountData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err.message);
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      {error && <p>{error}</p>}
      {user && (
        <div>
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <h4>Accounts</h4>
          <ul>
            {accounts.map(account => (
              <li key={account._id}>
                {account.accountType} - {account.accountNumber} - Balance: ${account.balance.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
