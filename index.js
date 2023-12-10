// Required modules for server setup
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const { google } = require('googleapis'); // Import Google APIs
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = 5001;

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Adjust the destination folder as needed

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kaustubh@mysql',
  database: 'agrico_db'
});

// Google Drive API authentication
const auth = new google.auth.GoogleAuth({
  keyFile: './agrico-407706-3c0eae293201.json', // Update with your service account key file
  scopes: 'https://www.googleapis.com/auth/drive', // Scope for Google Drive API access
});

const drive = google.drive({ version: 'v3', auth });

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Endpoint to handle registration data insertion and file upload
app.post('/BuyerLogin', upload.single('document'), async (req, res) => {
  const { name, username, email, password, mobile, address } = req.body;

  const sql = 'INSERT INTO buyer_info (buyerfullname, buyerusername, buyeremail, buyerpassword, buyermobileno, buyeraddress) VALUES (?, ?, ?, ?, ?, ?)';
  
  try {
    // Insert basic registration data into MySQL and capture insertId
    const insertOperation = await new Promise((resolve, reject) => {
      connection.query(sql, [name, username, email, password, mobile, address], (err, result) => {
        if (err) {
          console.error('Error inserting registration data:', err);
          reject(err);
        } else {
          console.log('Registration data inserted into MySQL!');
          resolve(result); // Resolve with the query result for further processing
        }
      });
    });

    const insertedId = insertOperation.insertId; // Access the insertId from the query result

    // Handle file upload to Google Drive
    if (req.file) {
      const fileMetadata = {
        name: req.file.originalname,
      };
      const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      };

      const uploadedFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
      });

      // Get the link to the uploaded file on Google Drive
      const fileLink = uploadedFile.data.webViewLink;

      // Update the database with the file link
      const updateSQL = 'UPDATE buyer_info SET buyerdocument = ? WHERE buyerid = ?';
      await new Promise((resolve, reject) => {
        connection.query(updateSQL, [fileLink, insertedId], async (err, result) => {
          if (err) {
            console.error('Error updating document link in MySQL:', err);
            reject(err);
          } else {
            console.log('Document link updated in MySQL!');
            try {
              const permission = await drive.permissions.create({
                fileId: uploadedFile.data.id,
                requestBody: {
                  role: 'reader',
                  type: 'user',
                  emailAddress: 'dharmekaustubh2003@gmail.com', // Replace with your email
                },
              });
              console.log('Permissions updated for your account!', permission.data);
              resolve();
            } catch (error) {
              console.error('Error updating permissions:', error);
              reject(error);
            }
          }
        });
      });

      // Remove the uploaded file from the local server
      fs.unlinkSync(req.file.path);
    }

    res.status(200).send('Registration data inserted successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Error occurred during registration');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
