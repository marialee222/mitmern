import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

const Layout = ({ children }) => {
  const { currentUser, handleLogout } = useUser();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand mb-0 h1 d-flex align-items-center" to="/">
            <img
              src="/images/bank.png"
              alt="Bank Logo"
              style={{ width: '40px', height: '40px', marginRight: '10px' }}
            />
            MITMERN Bank
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/createaccount">
                  Create Account
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/deposit">
                  Deposit
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/withdraw">
                  Withdraw
                </NavLink>
              </li>

              {/* Conditionally render Admin Dashboard link based on user role */}
              {currentUser && currentUser.role === 'admin' ? (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/dashboard">
                    Admin Dashboard
                  </NavLink>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/alldata">
                    All Data/Transfers
                  </NavLink>
                </li>
              )}

              {currentUser ? (
                <>
                  <li className="nav-item">
                    <button className="btn nav-link" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }} onClick={onLogout}>
                      Logout
                    </button>
                  </li>
                  <li className="nav-item welcome-message">
                    <span className="navbar-text">
                      Welcome, {currentUser.name || currentUser.email}!
                    </span>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mt-3">
        {children}
      </div>
    </div>
  );
};

export default Layout;
