const pool = require('../config/database');

const createTransaction = async (phoneNumber, transactionType, amount) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO Transactions (phoneNumber, transactionType, amount) VALUES (?, ?, ?)',
      [phoneNumber, transactionType, amount]
    );
    return result;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

const getTransactionsByPhone = async (phoneNumber) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Transactions WHERE phoneNumber = ? ORDER BY createdAt DESC', [phoneNumber]);
    return rows;
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

module.exports = {
  createTransaction,
  getTransactionsByPhone
};