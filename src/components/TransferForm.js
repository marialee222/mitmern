import React, { useState, useEffect } from 'react';
import { transferFunds, getUserAccounts } from '../services/api';
import { useUser } from '../context/UserProvider';

const TransferForm = ({ onSuccess }) => {
  const { currentUser } = useUser();
  const [sourceAccount, setSourceAccount] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getUserAccounts(currentUser.token);
        setAccounts(data);
      } catch (err) {
        console.error('Failed to fetch accounts:', err.message);
      }
    };

    fetchAccounts();
  }, [currentUser]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await transferFunds(
        currentUser.token,
        sourceAccount,
        destinationAccount,
        amount
      );

      setSuccessMessage('Transfer successful');
      setError('');

      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err.response && err.response.data.msg 
        ? err.response.data.msg 
        : 'Failed to transfer funds. Please try again.';
      setError(errorMessage);
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <form onSubmit={handleTransfer}>
        {error && <p className="text-danger">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <div className="form-group">
          <label htmlFor="sourceAccount">Source Account Number</label>
          <select
            id="sourceAccount"
            className="form-control"
            value={sourceAccount}
            onChange={(e) => setSourceAccount(e.target.value)}
          >
            <option value="">Select Source Account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account.accountNumber}>
                {account.accountNumber} - {account.accountType} - ${account.balance.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="destinationAccount">Destination Account Number</label>
          <input
            type="text"
            id="destinationAccount"
            className="form-control"
            value={destinationAccount}
            onChange={(e) => setDestinationAccount(e.target.value)}
            placeholder="Enter destination account number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Transfer</button>
      </form>
    </div>
  );
};

export default TransferForm;
