import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BankForm from './BankForm';
import { useUser } from '../context/UserProvider';

function Login() {
  const { handleLogin, errorMessage, setCurrentUser } = useUser();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isFormFilled, setIsFormFilled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await handleLogin(formData);
      if (response.token) {
        // Store the token and user data in local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Set the current user in your context
        setCurrentUser(response.user);

        // Clear the form data and redirect
        setFormData({ email: '', password: '' });
        navigate('/'); // Redirect to home or dashboard after login
      }
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }));
    setIsFormFilled(formData.email.trim() && formData.password.trim());
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card custom-bg-color" style={{ backgroundColor: 'transparent' }}>
            <div className="card-body">
              <h5 className="card-title text-white">LOGIN</h5>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <BankForm
                label="Your Information"
                fields={['email', 'password']}
                handle={handleSubmit}
                submitButtonLabel="Login"
                formData={formData}
                widthClass="col-md-12"
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                isFormFilled={isFormFilled}
                setIsFormFilled={setIsFormFilled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
