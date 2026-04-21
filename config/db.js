const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required database environment variables: ${missingEnvVars.join(', ')}`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function verifyDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (error) {
    console.error('Failed to initialize database connection pool:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  verifyDatabaseConnection,
};