import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserProvider';
import { getAllUsers } from '../services/api';

const AdminDashboard = () => {
  const { currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers(currentUser.token);
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    fetchData();
  }, [currentUser]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!users.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card bg-light">
            <div className="card-body sticky-header">
              <h2 className="card-title">Admin Dashboard</h2>
              <div className="table-responsive admin-dashboard" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Account Type</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.accounts.map(account => (
                            <div key={account._id}>{account.accountType}</div>
                          ))}
                        </td>
                        <td>
                          {user.accounts.map(account => (
                            <div key={account._id}>${account.balance.toFixed(2)}</div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
