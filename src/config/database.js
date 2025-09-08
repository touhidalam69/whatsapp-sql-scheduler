require('dotenv').config();
const sql = require('mssql');
const logger = require('./logger');

const isProduction = process.env.NODE_ENV === 'production';

const sqlConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: isProduction,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    logger.info('Connected to SQLServer...');
    pool.on('error', err => {
      logger.error('SQL Pool Error', err);
    });
    return pool;
  })
  .catch(err => {
    logger.error('Database Connection Failed! Bad Config: ', err);
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise,
  close: async () => {
    try {
      const pool = await poolPromise;
      if (pool) {
        await pool.close();
        logger.info('Database connection pool closed.');
      }
    } catch (e) {
      logger.error('Error closing database pool', e);
    }
  },
};