import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BankForm from './BankForm';
import { useUser } from '../context/UserProvider';
import { getUserAccounts, createTransaction } from '../services/api';

const Deposit = () => {
  const { currentUser } = useUser();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ amount: '0.00' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');
  const [isFormFilled, setIsFormFilled] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
      const fetchAccounts = async () => {
        try {
          const accounts = await getUserAccounts(currentUser.token);
          setAccounts(accounts);
          if (accounts.length > 0) {
            setSelectedAccount(accounts[0]._id);
            setBalance(accounts[0].balance);
          }
        } catch (error) {
          console.error('Failed to fetch accounts:', error.message);
          setErrorMessage('Failed to load account data');
        }
      };
      fetchAccounts();
    } else {
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    if (field === 'amount' && formData.amount === '0.00') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }));
    }
    setIsFormFilled(true);
  };

  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    const selected = accounts.find(account => account._id === accountId);
    setSelectedAccount(accountId);
    setBalance(selected ? selected.balance : 0);
  };

  const handleDeposit = async (data) => {
    setErrorMessage('');

    if (!isLoggedIn) {
      setErrorMessage('Please log in before depositing.');
      return;
    }

    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid positive number for deposit.');
      return;
    }

    try {
      const transactionData = {
        accountId: selectedAccount,
        amount,
        transactionType: 'deposit',
        description: 'Deposit from frontend'
      };
      
      const transactionResponse = await createTransaction(currentUser.token, transactionData);

      setTransactionMessage(`Deposit of $${amount.toFixed(2)} USD successful!`);
      setFormData({ ...formData, amount: '0.00' });
      setBalance(transactionResponse.transaction.amount + balance); 
      setIsFormFilled(false);
      setTimeout(() => {
        setTransactionMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error creating transaction:', error);
      setErrorMessage('Failed to process the deposit. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card custom-bg-color" style={{ backgroundColor: 'transparent' }}>
            <div className="card-body">
              <h5 className="card-title text-white">DEPOSIT</h5>
              {accounts.length > 0 && (
                <div className="form-group">
                  <label htmlFor="account" className="text-white">Select Account</label>
                  <select
                    id="account"
                    name="account"
                    className="form-control"
                    value={selectedAccount}
                    onChange={handleAccountChange}
                  >
                    {accounts.map(account => {
                      const accountTypeDisplay = Array.isArray(account.accountType)
                        ? account.accountType.join(', ')
                        : account.accountType;

                      return (
                        <option key={account._id} value={account._id}>
                          {`${accountTypeDisplay.charAt(0).toUpperCase() + accountTypeDisplay.slice(1)} - ${account.accountNumber}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center">
                <p className="card-text mb-0 text-white">Balance:</p>
                <p className="card-text mb-0 text-white">${balance.toFixed(2)} USD</p>
              </div>
              {errorMessage && <div className="alert alert-danger error-message">{errorMessage}</div>}
              {transactionMessage && <div className="alert alert-success success-message">{transactionMessage}</div>}
            </div>
            <div>
              {isLoggedIn ? (
                <BankForm
                  label="Deposit Amount"
                  fields={['amount']}
                  handle={handleDeposit}
                  submitButtonLabel="Deposit"
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                  isFormFilled={isFormFilled}
                  setIsFormFilled={setIsFormFilled}
                  widthClass="col-md-12" 
                />
              ) : (
                <p className="text-center">Please <Link to="/login">log in</Link> to deposit.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
