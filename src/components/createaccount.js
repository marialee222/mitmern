import React, { useState } from 'react';
import BankForm from './BankForm';
import { useUser } from '../context/UserProvider';

function CreateAccount() {
  const { handleRegister, currentUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    accountType: [],
  });
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!Array.isArray(formData.accountType) || formData.accountType.length === 0) {
      setErrorMessage('Please select at least one account type.');
      return;
    }
  
    const stayOnPage = true;
    const success = await handleRegister(formData, stayOnPage);
  
    if (success) {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'customer',
        accountType: [],
      });
      setIsFormFilled(false);
      setFormSubmitted(true);
      setAccountCreated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Account creation failed. Please try again.');
    }
  };

  const handleAccountTypeChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevState) => {
      const accountTypeArray = prevState.accountType;

      if (checked) {
        return { ...prevState, accountType: [...accountTypeArray, value] };
      } else {
        return { ...prevState, accountType: accountTypeArray.filter((type) => type !== value) };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 mb-4">
          <div className="card custom-bg-color" style={{ backgroundColor: 'transparent' }}>
            <div className="card-body">
              <h5 className="card-title text-white">CREATE ACCOUNT</h5>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {formSubmitted && <div className="alert alert-success"><b>{currentUser?.name || 'User'}</b>, your account has been created successfully! You can add another account or start enjoying our services.</div>}

              <BankForm
                label="Your Information"
                fields={['name', 'email', 'password', 'role']}
                handle={handleSubmit}
                submitButtonLabel={accountCreated ? "Add Another Account" : "Create Account"}
                formData={formData}
                widthClass="col-md-12"
                setFormData={setFormData}
                isFormFilled={isFormFilled}
                setIsFormFilled={setIsFormFilled}
                handleInputChange={handleInputChange}
                formType="createAccount"
              />

              <div className="form-group mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '15px', borderRadius: '5px' }}>
                <label className="form-label" htmlFor="accountType">Select Account Type(s):</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checking"
                    value="checking"
                    checked={formData.accountType.includes('checking')}
                    onChange={handleAccountTypeChange}
                  />
                  <label className="form-check-label" htmlFor="checking">Checking</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="savings"
                    value="savings"
                    checked={formData.accountType.includes('savings')}
                    onChange={handleAccountTypeChange}
                  />
                  <label className="form-check-label" htmlFor="savings">Savings</label>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
