
const { pool } = require('../config/db');

async function addSchool({ name, address, latitude, longitude }) {
  const query =
    'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  const values = [name, address, latitude, longitude];

  const [result] = await pool.execute(query, values);

  return {
    id: result.insertId,
    name,
    address,
    latitude,
    longitude,
  };
}

async function getAllSchools() {
  const query = 'SELECT * FROM schools';
  const [rows] = await pool.query(query);

  return rows;
}

module.exports = {
  addSchool,
  getAllSchools,
};
