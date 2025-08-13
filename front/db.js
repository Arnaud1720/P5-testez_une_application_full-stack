const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  password: '123456',
  database: 'test',
  port: 3307
});

module.exports = pool;
