import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Register} from './components/Register';
import {Login} from './components/Login';

export const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
  );
}
