const { Pool } = require('pg');
const mockDb = require('./mockDb');

let db;

try {
  // Try to connect to PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  // Test the connection
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err);
      console.log('Falling back to mock database');
      db = mockDb;
    } else {
      console.log('Successfully connected to PostgreSQL');
      db = {
        query: (text, params) => pool.query(text, params),
      };
    }
  });
} catch (error) {
  console.error('Error initializing database connection:', error);
  console.log('Falling back to mock database');
  db = mockDb;
}

// Export query function
module.exports = db; 