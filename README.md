# USSD Application

A USSD application with multiple language support, session management, and database integration.

## Features

- Multi-language support (English and Swahili)
- Session management
- Database integration
- Course information
- Exam schedules
- Fee balance checking

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables
4. Run the application: `npm start`

## Environment Variables

```
PORT=3000
AFRICAS_TALKING_API_KEY=your_api_key
AFRICAS_TALKING_USERNAME=your_username
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=your_db_port
```

## API Endpoints

- POST `/ussd` - USSD endpoint

## Database Schema

- Sessions table: Stores session information
- Transactions table: Records user transactions

## Deployment

This application can be deployed to Render using the provided `render.yaml` file.
```

## 7. Integrating with Africa's Talking

If you need to use Africa's Talking API for additional functionality (like sending SMS), you can create a utility file:

```javascript:utils/africastalking.js
const AfricasTalking = require('africastalking');
require('dotenv').config();

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USERNAME
});

// Get the SMS service
const sms = africastalking.SMS;

// Function to send SMS
const sendSMS = async (phoneNumber, message) => {
  try {
    const result = await sms.send({
      to: phoneNumber,
      message
    });
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = {
  sendSMS
};