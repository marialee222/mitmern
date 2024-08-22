import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BankForm from '../components/BankForm';
import { useUser } from '../context/UserProvider';

function Login() {
  const { handleLogin } = useUser();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log('Attempting to log in with:', formData);
    const isLoginSuccessful = await handleLogin(formData);
    if (isLoginSuccessful) {
      setShowErrorMessage(false);
      setFormData({ email: '', password: '' });
      navigate('/dashboard'); // Redirect after login
    } else {
      console.log('Login failed.');
      setShowErrorMessage(true);
    }
  };
  

  const handleInputChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    // Check if both fields are filled
    if (updatedFormData.email.trim() && updatedFormData.password.trim()) {
      setIsFormFilled(true);
    } else {
      setIsFormFilled(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card custom-bg-color">
            <div className="card-body">
              <h5 className="card-title text-white">LOGIN</h5>
              {showErrorMessage && (
                <div className="alert alert-danger">
                  Invalid email or password. Please try again.
                </div>
              )}
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
