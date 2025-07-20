const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');  // To handle file paths

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Make sure to serve frontend from the 'public' folder

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'verx'
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB Connection Error:', err);
  } else {
    console.log('✅ MySQL Connected!');
  }
});

// Serve the login page when hitting '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login form submission (POST request)
app.post('/login', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ message: 'Name and number required' });
  }

  const sql = 'INSERT INTO users (name, number, email) VALUES (?, ?, "")';
  db.query(sql, [name, number], (err, result) => {
    if (err) {
      console.error('❌ Insert error:', err);
      return res.status(500).json({ message: 'Failed to insert user' });
    }

    console.log('✅ User added:', result.insertId);
    res.status(200).json({ message: 'User added successfully', userId: result.insertId });
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
