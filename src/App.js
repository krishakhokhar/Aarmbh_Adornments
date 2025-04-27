import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './components/AdminLogin/Login';
import { Routes, Route, BrowserRouter, Router } from 'react-router-dom';
import MainLayout from './Pages/MainLayout/MainLayout';

function App() {
  return (

    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainlayout" element={<MainLayout />} />

      </Routes>

    </>
  )
}

export default App;
