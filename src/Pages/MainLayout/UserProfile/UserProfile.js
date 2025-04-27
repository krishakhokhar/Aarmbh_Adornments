import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation

const UserProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove items from localStorage
    localStorage.removeItem('adminId');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    
    // Redirect user to the home page
    navigate('/');
  };

  return (
    <div>
      <h1>User Profile</h1>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default UserProfile;
