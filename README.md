# NodeIMAP Email Client

This is a simple email client built with Node.js using the NodeIMAP library. It allows you to connect to an IMAP server, retrieve emails, and perform flag operations on them.

## Prerequisites

Before running the application, make sure you have the following:

- Node.js installed on your machine

## Getting Started

Follow the instructions below to get started with the NodeIMAP Email Client.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dilgo-dev/MailImap.git
   ```

2. Navigate to the project directory:

   ```bash
   cd MailImap
   ```
3. Install the dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Rename the .env.example file to .env.

2. Update the .env file with your email server credentials:

   ```dotenv
   MAIL_AUTH_USER="your-email@example.com"
   MAIL_AUTH_PASSWORD="your-password"
   MAIL_HOST="your-mail-server-host"
   MAIL_PORT="your-mail-server-port"
   MAIL_TLS="true"
   ```
Replace the placeholders with your actual email server details.

## Usage
The application consists of three main files:

 - connexion_imap.mjs: Establishes a connection with the IMAP server using the provided credentials from the .env file.

 - flagEmail.mjs: Flags an email with a specified flag. Modify the messageId and flag variables in this file to match your requirements.

 - getEmails.mjs: Retrieves and parses emails from the INBOX folder.

To run the application, execute the following command:

   ```bash
   node getEmails.mjs
   ```
This will fetch and display the emails from the INBOX folder.
