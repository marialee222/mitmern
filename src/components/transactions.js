import React, { useEffect, useState } from 'react';
import { getAccountTransactions } from '../services/api';

const Transactions = ({ token, accounts }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accounts || accounts.length === 0) {
        setError('No accounts found.');
        setLoading(false);
        return;
      }

      try {
        const allTransactions = await Promise.all(
          accounts.map(async (account) => {
            if (account && account._id) {
              const accountTransactions = await getAccountTransactions(token, account._id);
              return accountTransactions.map(transaction => ({
                ...transaction,
                accountNumber: account.accountNumber, // Add the account number to each transaction
              }));
            } else {
              console.warn('Invalid account ID:', account);
              return [];
            }
          })
        );

        const mergedTransactions = allTransactions.flat(); // Merge all transactions arrays into one
        console.log('Merged Transactions:', mergedTransactions); // Debug log

        setTransactions(mergedTransactions);

        if (mergedTransactions.length === 0) {
          setError('No transactions found for the given accounts.');
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err.message);
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, accounts]);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h5 className="card-title mt-4">Transactions ({transactions.length})</h5>
      {transactions.map((transaction, index) => (
        <div key={transaction._id || index} className="mb-3">
          <p><strong>Account Number:</strong> {transaction.accountNumber}</p> {/* Display the account number */}
          <p><strong>Transaction ID:</strong> {transaction._id}</p>
          <p><strong>Type:</strong> {transaction.transactionType}</p>
          <p><strong>Amount:</strong> ${transaction.amount.toFixed(2)}</p>
          <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
          {index < transactions.length - 1 && <hr />} {/* Add a divider except after the last transaction */}
        </div>
      ))}
    </div>
  );
};

export default Transactions;
