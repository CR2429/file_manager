require('dotenv').config({ 
    path: require('path').resolve(__dirname, '../../.env') 
});

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'langitia.com',
    port: 3306,
    user: 'CartageUser',
    password: process.env.DB_PASSWORD,
    database: 'cartage',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
