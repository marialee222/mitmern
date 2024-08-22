import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../services/api';
import { useUser } from '../context/UserProvider';
import TransferForm from './TransferForm';

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentUser && currentUser.token) {
        try {
          const response = await getUserDetails(currentUser.token, userId);
          setUserDetails(response);
        } catch (error) {
          console.error('Failed to fetch user details:', error.message);
          setError('Failed to fetch user details');
        }
      }
    };

    fetchUserDetails();
  }, [currentUser, userId]);

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p>{error}</p>}
      {userDetails ? (
        <div>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Role:</strong> {userDetails.role}</p>
          <h3>Accounts</h3>
          {userDetails.accounts && userDetails.accounts.length > 0 ? (
            <ul>
              {userDetails.accounts.map(account => (
                <li key={account._id}>
                  {account.accountType} - {account.accountNumber} - Balance: ${account.balance.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No accounts found.</p>
          )}

          <h3>Transfer Money</h3>
          <TransferForm />  {/* Include the TransferForm component here */}

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
