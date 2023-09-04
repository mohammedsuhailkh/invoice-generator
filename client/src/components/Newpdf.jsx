import html2pdf from 'html2pdf.js';
import './Newpdf.css';
import PDFContent from './PdfContent';
import numWords from 'num-words';
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer

const convertAmountToWords = (amount) => {
  const numericAmount = parseFloat(amount);
  if (!isNaN(numericAmount)) {
    return numWords(numericAmount).toUpperCase();
  }
  return "";
};

export const generatePDF = ({
  billNo,
  name,
  amount,
  selectedPaymentType,
  additionalFieldText,
  numericDate
}) => {
  console.log("Received input values:", billNo, name, amount, selectedPaymentType, additionalFieldText, numericDate);

  const pdfContent = (
    <PDFContent
      billNo={billNo}
      name={name}
      amount={amount}
      selectedPaymentType={selectedPaymentType}
      additionalFieldText={additionalFieldText}
      numericDate={numericDate}
      convertAmountToWords={convertAmountToWords}
    />
  );

  const element = document.createElement('div'); // Create a new div element

  // Render the component to an HTML string using ReactDOMServer
  const htmlString = ReactDOMServer.renderToString(pdfContent);

  // Set the innerHTML of the div element with the HTML string
  element.innerHTML = htmlString;

  // Configuration for html2pdf
  const options = {
    margin: 0,
    filename: `Invoice${name}${billNo}`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a5', orientation: 'landscape' },
  };

  // Generate the PDF
  html2pdf().from(element).set(options).save();

 
};

export default generatePDF;
