function parseUpcomingPayments(emailText, emailYear = new Date().getFullYear()) {
  // Match lines with a month and day, optionally with a year,
  // and an amount on the same or next line (fuzzy match)
  const paymentPattern = /([A-Za-z]{3,9}\s\d{1,2}(,\s*\d{4})?)\s*\n?\$([\d,.]+)/g;

  const payments = [];
  let match;

  while ((match = paymentPattern.exec(emailText)) !== null) {
    let dateStr = match[1];        // e.g. "Jun 2" or "June 2, 2025"
    const amountStr = match[3];    // e.g. "18.54"
    
    // If year is missing in dateStr, append emailYear
    if (!dateStr.match(/\d{4}/)) {
      dateStr = `${dateStr}, ${emailYear}`;
    }
    
    const date = new Date(dateStr);
    if (!isNaN(date)) {
      payments.push({
        date,
        amount: parseFloat(amountStr.replace(/,/g, '')),
      });
    }
  }

  console.log(`PAYMENTS ${payments}`)
  
  return payments;
}

module.exports = { parseUpcomingPayments };
