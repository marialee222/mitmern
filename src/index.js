import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; // Ensure this path is correct
import App from './App'; // Ensure this path is correct

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
