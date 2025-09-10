import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'devuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'trading_db',
  password: process.env.DB_PASSWORD || 'seggaq-qijxaw-1cawNu',
  port: process.env.DB_PORT || 5432,
});

export default pool;
