import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserProvider';
import Layout from './layout/Layout';
import Home from './components/home';
import CreateAccount from './components/createaccount';
import Login from './components/login';
import Deposit from './components/deposit';
import Withdraw from './components/withdraw';
import Balance from './components/balance';
import AllData from './components/alldata';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage'; // Updated to use ProfilePage instead of UserProfile
import ProtectedRoute from './routes/ProtectedRoute'; 
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <UserProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              
              {/* Wrap protected routes within a ProtectedRoute component */}
              <Route element={<ProtectedRoute />}>
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/balance" element={<Balance />} />
                <Route path="/alldata" element={<AllData />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/profile/:userId" element={<ProfilePage />} /> {/* Updated to ProfilePage */}
              </Route>

            </Routes>
          </Layout>
        </UserProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
