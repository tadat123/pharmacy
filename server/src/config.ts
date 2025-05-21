import dotenv from 'dotenv';
import path from 'path';

// Nạp biến môi trường từ file .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 5000,
  // Cấu hình MySQL với XAMPP
  dbConfig: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'), 
    database: process.env.DB_NAME || 'httt',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',  // Default XAMPP password thường là rỗng
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
}; 