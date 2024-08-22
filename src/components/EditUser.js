import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';
import { getUserDetails, updateUserDetails } from '../services/api';

const EditUser = () => {
  const { id } = useParams();
  const { currentUser } = useUser();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && currentUser.token) {
        try {
          const userDetails = await getUserDetails(currentUser.token, id);
          setFormData({ name: userDetails.name, email: userDetails.email });
        } catch (error) {
          setErrorMessage('Failed to fetch user details');
        }
      }
    };

    fetchData();
  }, [currentUser, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails(currentUser.token, id, formData);
      setSuccessMessage('User details updated successfully');
      setTimeout(() => {
        navigate('/admin'); // Redirect to admin dashboard after successful update
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to update user details');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Edit User</h5>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
