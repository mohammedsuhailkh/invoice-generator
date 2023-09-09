export const convertAmountToWords = (amount) => {
    try {
      const amountRegex = /^\d+(\.\d{1,2})?$/;
      if (!amount.match(amountRegex)) {
        return "Invalid amount"; // Handle non-numeric values
      }
  
      const [integerPart, decimalPart] = amount.split('.');
      let words = '';
  
      // Convert the integer part to words
      const numericIntegerPart = parseInt(integerPart, 10);
      if (!isNaN(numericIntegerPart) && numericIntegerPart !== 0) {
        words += numWords(numericIntegerPart).toUpperCase() + ' RUPEES ';
      }
  
      // Convert the decimal part to words if it exists
      if (decimalPart) {
        const numericDecimalPart = parseInt(decimalPart, 10);
        if (!isNaN(numericDecimalPart) && numericDecimalPart !== 0) {
          const decimalWords = numWords(numericDecimalPart).toUpperCase();
          words += `AND ${decimalWords} PAISE ONLY`;
        }
      }


  
      return words || "Zero Rupees"; // Handle zero amount
    } catch (error) {
      console.error("Error converting amount to words:", error);
      return "Conversion error"; // Handle any conversion errors
    }
  };
  

  