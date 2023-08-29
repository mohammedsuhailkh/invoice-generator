import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login.jsx';
import InvoiceGenerator from './components/InvoiceGenerator.jsx';
import Entries from './components/Entries.jsx';

const rootElement = document.getElementById('root');

const App = () => (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/invoiceGenerator" element={<InvoiceGenerator />} />
        <Route path="/entries" element={<Entries />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

ReactDOM.createRoot(rootElement).render(<App />);
