import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file

const LoginPage = () => {
  const [accessId, setAccessId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://heavensmanagement.onrender.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: accessId, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // console.log('Login response data:', data);
  
        // Check if the response has the required data
        if (data.role) {
          // Save the role to localStorage
          localStorage.setItem('userRole', data.role);
  
          // Save optional fields to localStorage if they exist
          if (data.propertyName) {
            localStorage.setItem('userPropertyName', data.propertyName);
          }
          if (data.propertyId) {
            localStorage.setItem('userPropertyId', data.propertyId);
          }
  
          // Navigate based on the role
          if (data.role === 'property-manager') {
            navigate('/dashboard-property-manage');
          } else if (data.role === 'heavens-admin') {
            navigate('/'); // Make sure to set this route correctly
          } else {
            navigate('/');
          }
        } else {
          alert('Unexpected response format');
        }
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred');
    }
  };
  
  

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="https://res.cloudinary.com/duor53jtl/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1723710691/HEAVENS_LIVING_1_sgqdss.png"
          alt="Heavens Logo"
          className="logo"
        />
        <h2 className="sign-in-text">Sign in</h2>
        <p className="description-text">to continue using Heavens Management Portal</p>
        
        <input
          type="text"
          placeholder="Enter Access ID"
          className="login-input"
          value={accessId}
          onChange={(e) => setAccessId(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>Next</button>
      </div>
    </div>
  );
};

export default LoginPage;
