const pool = require('../config/database');

const initializeDatabase = async () => {
  try {
    // Create Sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Sessions (
        sessionId VARCHAR(255) PRIMARY KEY,
        phoneNumber VARCHAR(20) NOT NULL,
        userInput TEXT,
        language VARCHAR(10) DEFAULT 'en',
        menuLevel INT DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phoneNumber VARCHAR(20) NOT NULL,
        transactionType VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2),
        status VARCHAR(20) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { initializeDatabase };