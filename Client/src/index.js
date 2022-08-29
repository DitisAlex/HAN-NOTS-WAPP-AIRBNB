import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import 'bootstrap/dist/css/bootstrap.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <App />
);