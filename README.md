# Google-Drive-Integration-with-Node.js-for-Document-Storage

### Description
This repository contains the server-side code for a Node.js application that enables users to upload documents to Google Drive and store corresponding file links in a MySQL database. This code is meant to be used as the backend service.

### Features
Upload documents to Google Drive.<br>
Store file links in a MySQL database.<br>
Handle user registration data along with document uploads.<br>

### Components
Server-side code: Contains the Node.js code responsible for handling document uploads and interactions with Google Drive and MySQL database.<br>
(Mention if frontend code exists, as specified in your query)<br>

### Prerequisites
Node.js installed on your machine.<br>
MySQL database set up and configured.<br>
Google Cloud Platform (GCP) project with Drive API enabled.<br>
Service account key file for GCP with appropriate permissions.<br>

### Setup Instructions
Clone the repository to your local machine.<br>
bash<br>
Copy code<br>
git clone https://github.com/your-username/your-repo.git<br>
Install the necessary dependencies.<br>

bash<br>
Copy code<br>
npm install<br>

### Set up environment variables or configuration files:
Place your service account key file (JSON) obtained from GCP in the project directory.<br>
Configure the MySQL connection details in index.js.<br>
Update the scopes and necessary permissions in the Google authentication setup.<br>
Start the application.<br>

bash<br>
Copy code<br>
npm start<br>

### Usage
Access the specified endpoint (e.g., http://localhost:5001/BuyerLogin) with the required registration data and document file to upload.<br>
Verify successful uploads by checking the console logs, Google Drive for uploaded files, and the MySQL database for stored links.<br>

### Possible Issues
Access Permissions: Ensure that the service account has the required permissions for the Google Drive API.<br>
Network Connectivity: Verify stable internet connectivity for interactions with Google Drive and MySQL.<br>
Credentials and Configurations: Double-check the accuracy of credentials, paths, and configuration details specified in the code.<br>

### Contributing
Contributions are welcome! If you encounter issues or have suggestions for improvements, feel free to open an issue or create a pull request.<br>

