const pool = require('../config/database');

const createSession = async (sessionId, phoneNumber) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO Sessions (sessionId, phoneNumber) VALUES (?, ?) ON DUPLICATE KEY UPDATE updatedAt = CURRENT_TIMESTAMP',
      [sessionId, phoneNumber]
    );
    return result;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

const getSession = async (sessionId) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sessions WHERE sessionId = ?', [sessionId]);
    return rows[0];
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

const updateSession = async (sessionId, data) => {
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    
    const query = `UPDATE Sessions SET ${setClause} WHERE sessionId = ?`;
    
    const [result] = await pool.query(query, [...values, sessionId]);
    return result;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

module.exports = {
  createSession,
  getSession,
  updateSession
};