import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import numWords from "num-words";
import "./Entries.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import html2pdf from "html2pdf.js";
import PDFContent from "./PdfContent";
import ReactDOM from "react-dom";


function Entries() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchedEntries, setMatchedEntries] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/fetch-entries?search=${searchTerm}`
        );
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEntries();
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm === "") {
      setMatchedEntries([]);
    } else {
      const matches = entries.filter(
        (entry) =>
          entry.billNo.toString() === searchTerm ||
          entry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMatchedEntries(matches);
    }
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

  const generatePDF = async (personData) => {
    const container = document.createElement("div");
    // document.body.appendChild(container); // Append the container to the body
  
    const { billNo, name, amount, payment_type, additional_field, dd_date, cheque_date } = personData;
  
    ReactDOM.render(
      <PDFContent
        billNo={billNo}
        name={name}
        amount={amount}
        selectedPaymentType={payment_type}
        additionalFieldText={additional_field}
        numericDate={numericDate}
        convertAmountToWords={convertAmountToWords}
      />,
      container
    );
  
    const options = {
      margin: 0,
      filename: `Invoice${name}${billNo}`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a5", orientation: "landscape" },
    };
  
    // Generate the PDF from the container
    await html2pdf().from(container).set(options).save();
  
    // Remove the container from the body
    document.body.removeChild(container);
  };
  

  return (
    <div className="entries-container">
      <Link to="/invoiceGenerator" className="back-button">
        <ArrowBackIcon />
      </Link>
      <h1>Search Cash Receipts</h1>
      <div className="search-bar">
        <input
          className="input-field"
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
              <tr>{/* Placeholder for no matching entries */}</tr>
            ) : (
              matchedEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
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
      <div ref={containerRef} style={{ display: "none" }}></div>
    </div>
  );
}

export default Entries;
