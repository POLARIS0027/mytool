import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Report from './report';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
