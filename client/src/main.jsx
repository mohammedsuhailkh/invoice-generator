import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login';
import InvoiceGenerator from './components/InvoiceGenerator';
import Entries from './components/Entries';
import PDFContent from './components/PdfContent';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/invoiceGenerator" element={<InvoiceGenerator/>} />
        <Route path="/entries" element={<Entries/>} />
        <Route path="/pdf" element={<PDFContent/>} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
