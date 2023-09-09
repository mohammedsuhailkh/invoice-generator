




const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'invoiceGenerator'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Check if credentials match in the database
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.sendStatus(500);
      return;
    }
    if (results.length > 0) {
      res.sendStatus(200); // Send success status
    } else {
      res.sendStatus(401); // Send unauthorized status
    }
  });
});



app.get('/api/fetch-entries', (req, res) => {
  const query = 'SELECT * FROM invoices';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
});

app.post('/api/save-data', (req, res) => {
const { billNo, name, amount, paymentType, additionalFieldText, chequeDate, ddDate, convertAmountToWords } = req.body;

const query = 'INSERT INTO invoices (name, amount, payment_type, additional_field, billNo, cheque_date, dd_date, amount_to_words) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
db.query(
  query,
  [name, amount, paymentType, additionalFieldText, billNo, chequeDate, ddDate, convertAmountToWords], // Ensure the order matches the query
  (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200); // Successful insertion
  }
);
});






  app.get('/api/fetch-last-billNo', (req, res) => {
      const query = 'SELECT billNo FROM invoices WHERE id = (SELECT MAX(id) FROM invoices)';
      db.query(query, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          res.sendStatus(500);
          return;
        }
    
        if (results.length === 0) {
          // If there are no entries, create an entry with billNo 1001
          const initialBillNo = 1001;
          const initialEntryQuery = 'INSERT INTO invoices (billNo) VALUES (?)';
          db.query(initialEntryQuery, [initialBillNo], (err, insertResult) => {
            if (err) {
              console.error('Error creating initial entry:', err);
              res.sendStatus(500);
              return;
            }
            res.json({ lastBillNo: initialBillNo });
          });
        } else {
          // Extract the lastBillNo from the query result
          const lastBillNo = results[0].billNo || 0;
          res.json({ lastBillNo });
        }
      });
    });
    
  
  




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});