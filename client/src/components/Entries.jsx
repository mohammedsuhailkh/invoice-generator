import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import iconImage from "../assets/logo.png";
import signature from "../assets/sign.png";
import numWords from 'num-words';
import './Entries.css';
import calibri from '../../public/Calibri Light.ttf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Entries() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedEntries, setMatchedEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/fetch-entries?search=${searchTerm}`
        );
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEntries();
  }, [searchTerm]);

  const currentDate = new Date();
  const numericDate = currentDate.toLocaleDateString("en-US");

  const handleSearch = () => {
    if (searchTerm === '') {
      setMatchedEntries([]);
    } else {
      const matches = entries.filter(
        entry =>
          entry.billNo.toString() === searchTerm ||
          entry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMatchedEntries(matches);
    }
  };

  const convertAmountToWords = amount => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      return numWords(numericAmount).toUpperCase();
    }
    return '';
  };

  const generatePDF = (entry) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5',
    });
  
    doc.addImage(iconImage, 'PNG', 10, 10, 20, 20);
    doc.addFont(calibri, 'calibri', 'normal');
  
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
  
    doc.text("CASH RECEIPT", 80, 30);
    doc.text("S R LAKSHADWEEP TOURS & TRAVELS", 48, 40);
  
    doc.setFont('calibri', 'normal');
    doc.setFontSize(14);
  
    doc.text(
      'EX-TK Building, Marar Road, Kinship Building Willingdon Island, Kochi 682003',
      25,
      45
    );
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
  
    doc.setFont("Times");
    doc.setFontSize(12);
    doc.text(`Date: ${numericDate}`, 170, 60);
  
    doc.text(`Invoice No: ${entry.billNo}`, 10, 60);
    doc.text(`Received with thanks from      ${entry.name}`, 10, 80);
    doc.text(`the sum of Rs   ${entry.amount}    (Rupees)`, 10, 90);
    doc.text(`${convertAmountToWords(entry.amount)}`, 70, 90);
    doc.text(`only By ${entry.payment_type} NO: ${entry.additional_field}`, 10, 100);
    doc.text(`Dated  ${numericDate}  being the advance Fee`, 10, 110);
    doc.text(`Rs : ${entry.amount}  `, 10, 120);
    doc.text(`Managing Director `, 170, 140);
    doc.addImage(signature, 'PNG', 170, 120, 30, 20);
  
    // Use a unique name for the PDF file
    const fileName = `invoice_${entry.id}.pdf`;
  
    // Save the PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = fileName;
    a.click();
  
    setSelectedEntry(null); // Reset selected entry
  };
  
  

  return (
    <div className="entries-container">
      <Link to="/invoiceGenerator" className="back-button">
        <ArrowBackIcon/>
      </Link>
      <h1>Search Cash Receipts</h1>
      <div className="search-bar">
        <input
          className='input-field'
          type="text"
          placeholder="Enter key"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
     
      <div className="table-container">
        <table>
          <tbody>
            {matchedEntries.length === 0 ? (
              <tr>
                {/* Placeholder for no matching entries */}
              </tr>
            ) : (
              matchedEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.billNo}</td>
                  <td>{entry.name}</td>
                  <td>Rs/ {entry.amount}</td>
                  <td>{entry.payment_type}</td>
                  <td>{entry.additional_field}</td>
                  <td>
                    {entry.dd_date
                      ? new Date(entry.dd_date).toLocaleDateString("en-US")
                      : "N/A"}
                  </td>
                  <td>
                    {entry.cheque_date
                      ? new Date(entry.cheque_date).toLocaleDateString("en-US")
                      : "N/A"}
                  </td>
                  <td>
                    <div className="download-button-container">
                      <button
                        className="download-button"
                        onClick={() => generatePDF(entry)}
                      >
                        Download PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Entries;
