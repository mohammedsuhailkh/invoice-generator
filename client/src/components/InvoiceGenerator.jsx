import React, { useState } from "react";
import jsPDF from "jspdf";
import numWords from "num-words";
import iconImage from "../assets/logo.png";
import signature from '../assets/sign.png'
import { useNavigate } from "react-router-dom";
import "./InvoiceGenerator.css";
import calibri from '../../public/Calibri Light.ttf';

const InvoiceGenerator = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [showAdditionalField, setShowAdditionalField] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [additionalFieldText, setAdditionalFieldText] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [ddDate, setDdDate] = useState("");

  const navigate = useNavigate();
  const billNo = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  const handlePaymentTypeChange = (event) => {
    const value = event.target.value;
    setSelectedPaymentType(value);

    setChequeDate("");
    setDdDate("");

    // Show the additional field only for "Cheque" or "DD No"
    setShowAdditionalField(value === "cheque" || value === "dd");
  };
  const handleAdditionalFieldChange = (event) => {
    setAdditionalFieldText(event.target.value);
  };

  const convertAmountToWords = (amount) => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      return numWords(numericAmount).toUpperCase();
    }
    return "";
  };

  const currentDate = new Date();
  const numericDate = currentDate.toLocaleDateString("en-US");

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a5",
      });
      doc.addFont(calibri, 'calibri', 'normal');

      doc.addImage(iconImage, 'PNG', 10, 10, 20, 20);

      // Set font style
      doc.setFont("Times", "bold");
      doc.setFontSize(14);

      doc.text("CASH RECEIPT", 80, 30);
      doc.text("S R LAKSHADWEEP TOURS & TRAVELS", 48, 40);

      // Reset font style
      doc.setFont('calibri', 'normal'); // Set font to Calibri with normal font weight
      doc.setFontSize(14); // Set font size to 14px
      
      doc.text(
        'EX-TK Building, Marar Road, Kinship Building Willingdon Island, Kochi 682003',
        25,
        45
      );

      doc.setFont("Times");
      doc.setFontSize(12);
      doc.text(`Date: ${numericDate}`, 170, 60);

      doc.text(`Invoice No: ${billNo}`, 10, 60);
      doc.text(`Received with thanks from      ${name}`, 10, 80);

      // doc.setTextColor(255, 0, 0);
      doc.text(`the sum of Rs   ${amount}    (Rupees)`, 10, 90);
      // doc.setTextColor(0, 0, 0);

      doc.text(`${convertAmountToWords(amount)}`, 70, 90);
      doc.text(
        `only By ${selectedPaymentType} NO: ${additionalFieldText}`,
        10,
        100
      );
      doc.text(`Dated   ${numericDate}  being the advance Fee`, 10, 110);
      doc.text(`Rs : ${amount}  `, 10, 120);
      doc.text(`Managing Director `, 170, 140);
      doc.addImage(signature, 'PNG', 170, 120, 30, 20);

      // Save the PDF with a specific file name
      doc.save(`invoice_${billNo}.pdf`);

      // Call the async function to save data
      await saveData();

      setAmount("");
      setName("");
      setSelectedPaymentType("null");
      setSelectedPaymentType(" ");
      setShowAdditionalField(false);
      setsponsorer("");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // save data into the db

  const saveData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          amount,
          
          paymentType: selectedPaymentType,
          additionalFieldText,
          billNo,
          chequeDate: chequeDate || null, 
          ddDate: ddDate || null, 
        }),
      });

      if (response.ok) {
        // Data saved successfully
        console.log("Data saved successfully");
      } else {
        console.error("Data could not be saved:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleEntry = () => {
    navigate("/entries");
  };


  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    
    // Ensure double-digit day and month
    const formattedDay = (day < 10) ? `0${day}` : day;
    const formattedMonth = (month < 10) ? `0${month}` : month;
    
    return `${formattedDay}-${formattedMonth}-${year}`;
  }

  

  return (
    <div className="main-container">
      <div className="container">
        <div className="header">
          <h3 className="branding">
            SR Lakshadweep <br /> Tours & Travels
          </h3>
          <div className="header-menu">
            <a className="links" onClick={handleEntry}>
              Search
            </a>
            <a className="links">|</a>

            <a className="links" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </div>

        <div class="center-container">
          <h3 class="title">- Cash Receipt -</h3>
        </div>

        <form>
          <div className="gap-btw">
            <h3 className="invoice-subheading">Invoice No. </h3>
            <h3 className="bill">{billNo}</h3>

            <h3 className="invoice-subheading">Date: {numericDate}</h3>
          </div>

          <h3 className="invoice-subheading" htmlFor="name">
            Name:
          </h3>
          <input
            className="input-field"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            
          />
          <h3 className=" invoice-subheading" htmlFor="amount">
            Amount:
          </h3>
          <input
            className="input-field"
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="payment-type-container">
            <h3 className="invoice-subheading">Payment Type:</h3>

            <div className="radio-container">
          
            <label  className="invoice-subheading">
            <input
              type="radio"
              name="paymentType"
              value="cash"
              onChange={handlePaymentTypeChange}
             
            />
              Cash</label>
            
            <label  className="invoice-subheading">
            <input
            
              type="radio"
              name="paymentType"
              value="cheque"
              onChange={handlePaymentTypeChange}
             
            />Cheque No
            </label>
            
            <label  className="invoice-subheading">
            <input
              type="radio"
              name="paymentType"
              value="dd"
              onChange={handlePaymentTypeChange}
              
            />DD No
            </label>
            </div>
            
          </div>
              <div className="fixed-height">

              {showAdditionalField && (
  <div className="additional-field-container">
    <div className="input-container">
      <label className="invoice-subheading" htmlFor="additional-input">
        {selectedPaymentType === "cheque" ? "Cheque No:" : "DD No:"}
      </label><br />
      <input
        id="additional-input"
        className="radio-input-field"
        type="text"
        value={additionalFieldText}
        onChange={handleAdditionalFieldChange}
      />
    </div>

    {selectedPaymentType === "cheque" && (
      <div className="input-container">
        <label className="invoice-subheading" htmlFor="cheque-date">
          Cheque Date:
        </label><br />
        <input
          id="cheque-date"
          className="date-input-field"
          type="date"
          value={chequeDate}
          onChange={(e) => setChequeDate(e.target.value)}
        />
      </div>
    )}

    {selectedPaymentType === "dd" && (
      <div className="input-container">
        <label className="invoice-subheading" htmlFor="dd-date">
          DD Date:
        </label><br />
        <input
          id="dd-date"
          className="date-input-field"
          type="date"
          value={ddDate}
          onChange={(e) => setDdDate(e.target.value)}
        />
      </div>
    )}
  </div>
)}


              </div>
          
          <br />

    
          <br />

          <button
            className="generate-pdf-button"
            type="submit"
            onClick={generatePDF}
            onSubmit={() => navigate("/invoiceGenerator")}
          >
            Generate PDF
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
