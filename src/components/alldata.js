import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserProvider';
import { getUserDetails } from '../services/api';
import Transactions from './transactions';
import TransferForm from './TransferForm';

const AllData = () => {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    if (!currentUser || !currentUser._id) {
      console.error('User ID is undefined in AllData component.');
      setError('User ID is undefined');
      return;
    }

    try {
      const data = await getUserDetails(currentUser.token, currentUser._id);
      setUserData(data);
    } catch (err) {
      console.error('Failed to fetch user data:', err.message);
      setError(err.message || 'Failed to fetch user details');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { user } = userData;
  const { name, email, role, accounts } = user;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="scrollable-container">
            <nav>
              <ul>
                <li><a href="#user-info">User Information</a></li>
                <li><a href="#accounts">Accounts</a></li>
                <li><a href="#transfer-funds">Transfer Funds</a></li>
                <li><a href="#recent-transactions">Recent Transactions</a></li>
              </ul>
            </nav>
            <div id="user-info" className="card" style={{ backgroundColor: '#f8f9fa', borderColor: '#17a2b8' }}>
              <div className="card-body">
                <h5 className="card-title text-primary">User Information</h5>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Role:</strong> {role}</p>
              </div>
            </div>

            <div id="accounts" className="card mt-4" style={{ backgroundColor: '#f8f9fa', borderColor: '#28a745' }}>
              <div className="card-body">
                <h5 className="card-title text-success">Accounts</h5>
                {accounts.map(account => (
                  <div key={account._id} className="mb-3" style={{ borderBottom: '1px solid #ced4da' }}>
                    <p><strong>Account Type:</strong> {account.accountType}</p>
                    <p><strong>Account Number:</strong> {account.accountNumber}</p>
                    <p><strong>Balance:</strong> ${account.balance}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="transfer-funds" className="card mt-4" style={{ backgroundColor: '#f8f9fa', borderColor: '#ffc107' }}>
              <div className="card-body">
                <h5 className="card-title text-warning">Transfer Funds</h5>
                <TransferForm onSuccess={fetchUserData} />
              </div>
            </div>

            <div id="recent-transactions" className="card mt-4" style={{ backgroundColor: '#f8f9fa', borderColor: '#007bff' }}>
              <div className="card-body">
                <h5 className="card-title text-info">Recent Transactions</h5>
                <Transactions token={currentUser.token} accounts={accounts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllData;
