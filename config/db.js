import { createPool } from 'mysql2/promise'
import dotenv from "dotenv";

dotenv.config();
export const pool =   createPool({
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true, // ✅ evita errores al llegar al límite
    connectionLimit: 5,       // ✅ máximo que permite Clever Cloud
    queueLimit: 0             // 0 = sin límite en la cola
})