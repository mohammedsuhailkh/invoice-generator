import React from 'react';
import numWords from 'num-words';
import './Newpdf.css';

const containerStyle = {
  fontFamily: 'Times New Roman',
  margin: '10px',
};



const PDFContent = ({
  billNo,
  name,
  amount,
  selectedPaymentType,
  additionalFieldText ,
  numericDate,
  convertAmountToWords,
  ddDate,
  chequeDate,
}) => {
  // Convert the 'name' to uppercase
  const uppercaseName = name.toUpperCase();

  console.log("Data received in PDFContent:", {
    billNo,
    name,
    amount,
    selectedPaymentType,
    additionalFieldText,
    numericDate,
  });

  return (
    <div className='mainpdf'>
      {/* Your HTML content goes here */}
      <div id="div" style={containerStyle}>
        {/* Your HTML content */}
        <div className="pdf-container">
          <img src="../src/assets/logo.png" alt="" className='pdf-icon' />

          <div className="pdf-header">
            <h1>CASH RECEIPT</h1>
            <h2 className='pdf-mainhead'>S R LAKSHADWEEP TOURS & TRAVELS</h2>
          </div>
          <div className="pdf-address">
            <p>EX-TK Building, Marar Road, Kinship Building Willingdon Island, Kochi 682003</p>
          </div>
          <div className="pdf-details">
            <div className="pdf-topDate">
              <p>Invoice No: <b className='pdf-billno'>{billNo}</b></p>
              <p>Date: {numericDate}</p>
            </div>
            {/* Use 'uppercaseName' instead of 'name' */}
            <p>
                  Received with thanks from <b>{uppercaseName}</b> the sum of Rs <b>{amount}</b> (Rupees <b>{convertAmountToWords}</b>) only {" "}
                  {selectedPaymentType === 'cheque' ? 'By Cheque No ' : selectedPaymentType === 'dd' ? 'By DD Number ' : selectedPaymentType === 'cash' ? ' in Cash ' : " "}
                  {selectedPaymentType !== 'cash' ? <><b>{additionalFieldText}</b> {selectedPaymentType === 'cash' ? ' ' : 'Dated '} <b>{selectedPaymentType === 'cheque' ? chequeDate : selectedPaymentType === 'dd' ? ddDate : ''}</b></> : ''}
                  {" "}being the advance Fee
                  <br /><br /> Rs: <b className='pdf-amountB'>{amount}</b>
            </p>
          </div>
          <div className="pdf-signature">
            <p>Managing Director</p>
            <img src="../src/assets/sign.png" alt="" className='pdf-sign' />
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PDFContent;
