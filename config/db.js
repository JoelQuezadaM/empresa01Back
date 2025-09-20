import { createPool } from 'mysql2/promise'
import dotenv from "dotenv";

dotenv.config();
export const pool =   createPool({
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD || '123456',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'empresa01'
})