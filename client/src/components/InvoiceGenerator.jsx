import React, { useState, useEffect } from "react";
import numWords from "num-words";
import { useNavigate } from "react-router-dom";
import "./InvoiceGenerator.css";
import { generatePDF } from "./Newpdf.jsx";

const InvoiceGenerator = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [showAdditionalField, setShowAdditionalField] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [additionalFieldText, setAdditionalFieldText] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [ddDate, setDdDate] = useState("");
  const [billNo, setBillNo] = useState(1000);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the last billNo from the database and set it as the initial value
    fetchLastBillNoFromDatabase()
      .then((lastBillNo) => {
        // Set the last billNo + 1000 as the initial billNo
        setBillNo( ( lastBillNo + 1));
      })
      .catch((error) => {
        console.error("Error fetching last billNo:", error);
      });
  }, []);

  const fetchLastBillNoFromDatabase = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/fetch-last-billNo");
      if (response.ok) {
        const data = await response.json();
        return data.lastBillNo;
      } else {
        console.error("Failed to fetch last billNo:", response.statusText);
        return 0; // Default value in case of an error
      }
    } catch (error) {
      console.error("Error fetching last billNo:", error);
      return 0; // Default value in case of an error
    }
  };

  const handlePaymentTypeChange = (event) => {
    const value = event.target.value;
    setSelectedPaymentType(value === selectedPaymentType ? null : value);
  
    setChequeDate("");
    setDdDate("");
    
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


  const updateBillNo = (newBillNo) => {
    if (newBillNo >= 1000 && newBillNo <= 9999) {
      setBillNo(newBillNo);
    } else if (newBillNo >= 9999) {
      setBillNo(1000);
    }
  };





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


  const handleDownloadPDF = async () => {
    try {
      // Fetch the latest billNo from the database before generating the PDF
      const latestBillNo = await fetchLastBillNoFromDatabase();
      
      if (!name || !amount || !selectedPaymentType) {
        alert("Please fill in all required fields.");
        return;
      }

      if (selectedPaymentType === "cheque" && !chequeDate) {
        alert("Please enter a valid Cheque Date.");
        return;
      }

      if (selectedPaymentType === "cheque" && !additionalFieldText) {
        alert("Please enter a valid cheque no.");
        return;
      }

      if (selectedPaymentType === "dd" && !additionalFieldText) {
        alert("Please enter a valid dd no.");
        return;
      }

      if (selectedPaymentType === "dd" && !ddDate) {
        alert("Please enter a valid DD Date.");
        return;
      }



      // Use the latest billNo to generate the PDF
      generatePDF({
        billNo,
        name,
        amount,
        selectedPaymentType,
        additionalFieldText,
        numericDate,
        convertAmountToWords,
      });

      // Save the data with the latest billNo
      await saveData();

      updateBillNo(billNo + 1);

      // Set the new billNo
      // setBillNo(billNo + 1);

      // Clear the form fields
      setAmount("");
      setName("");
      setSelectedPaymentType(false); 
      setAdditionalFieldText("");
      setShowAdditionalField('');
      setChequeDate("");
      setDdDate("");


      // uncheck the radio buttons
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      radioButtons.forEach((radioButton) => {
        radioButton.checked = false;
      });

  
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  


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

        <div className="center-container">
          <h3 className="title">- Cash Receipt -</h3>
        </div>

        <form >
          <div className="gap-btw">
            <div>
              <h3 className="invoice-subheading">Invoice No. </h3>
              <h3 className="bill">{billNo}</h3>
            </div>
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
            required
            autoFocus
            autoComplete="off" 
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
              <label className="invoice-subheading">
                <input
                  type="radio"
                  name="paymentType"
                  value="cash"
                  onChange={handlePaymentTypeChange}
                />
                Cash
              </label>

              <label className="invoice-subheading">
                <input
                  type="radio"
                  name="paymentType"
                  value="cheque"
                  onChange={handlePaymentTypeChange}
                />
                Cheque No
              </label>

              <label className="invoice-subheading">
                <input
                  type="radio"
                  name="paymentType"
                  value="dd"
                  onChange={handlePaymentTypeChange}
                />
                DD No
              </label>
            </div>
          </div>
          <div className="fixed-height">
            {showAdditionalField && (
              <div className="additional-field-container">
                <div className="input-container">
                  <label
                    className="invoice-subheading"
                    htmlFor="additional-input"
                  >
                    {selectedPaymentType === "cheque" ? "Cheque No:" : "DD No:"}
                  </label>
                  <br />
                  <input
                    id="additional-input"
                    className="radio-input-field"
                    type="text"
                    value={additionalFieldText}
                    onChange={handleAdditionalFieldChange}
                    autoComplete="off" 
                  />
                </div>

                {selectedPaymentType === "cheque" && (
                  <div className="input-container">
                    <label className="invoice-subheading" htmlFor="cheque-date">
                      Cheque Date:
                    </label>
                    <br />
                    <input
                      id="cheque-date"
                      className="date-input-field"
                      type="date"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                {selectedPaymentType === "dd" && (
                  <div className="input-container">
                    <label className="invoice-subheading" htmlFor="dd-date">
                      DD Date:
                    </label>
                    <br />
                    <input
                      id="dd-date"
                      className="date-input-field"
                      type="date"
                      value={ddDate}
                      onChange={(e) => setDdDate(e.target.value)}
                      required
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
            type="button"
            onClick={handleDownloadPDF}
            
          >
            Generate PDF
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
