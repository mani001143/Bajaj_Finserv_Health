const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and form-data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer setup for file handling (if needed)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route
app.post('/bfhl', upload.single('file'), (req, res) => {
  const { data } = req.body;

  // Validate that 'data' is an array
  if (!Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: "Invalid input. Expected an array."
    });
  }

  // Separate numbers and alphabets
  let numbers = [];
  let alphabets = [];
  let highestLowercase = null;

  // Process each element in the data array
  data.forEach(item => {
    // Check if it's a number
    if (!isNaN(item)) {
      numbers.push(item);
    }
    // Check if it's an alphabet
    else if (/^[A-Za-z]+$/.test(item)) {
      alphabets.push(item);
      // Determine the highest lowercase alphabet
      if (item === item.toLowerCase()) {
        if (!highestLowercase || item > highestLowercase) {
          highestLowercase = item;
        }
      }
    }
  });

  // Sort alphabets lexicographically
  alphabets.sort((a, b) => a.localeCompare(b));

  // File validation (if required)
  let file_valid = false;
  let file_mime_type = null;
  let file_size_kb = null;

  // Check if a file was uploaded and get its details
  if (req.file) {
    file_valid = true;
    file_mime_type = req.file.mimetype;
    file_size_kb = (req.file.size / 1024).toFixed(2); // Convert bytes to KB
  }

  // Prepare the response in the correct format
  const response = {
    "is_success": true,
    "user_id": "prafull_raj_03112002",
    "email": "prafull_raj@srmap.edu.in",
    "roll_number": "AP21110011016",
    "numbers": numbers,
    "alphabets": alphabets,
    "highest_lowercase_alphabet": highestLowercase ? [highestLowercase] : [],
    "file_valid": file_valid,
    "file_mime_type": file_mime_type,
    "file_size_kb": file_size_kb
  };

  // Send the response
  res.status(200).json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
