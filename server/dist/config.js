"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Nạp biến môi trường từ file .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
exports.config = {
    port: process.env.PORT || 5000,
    // Cấu hình MySQL với XAMPP
    dbConfig: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        database: process.env.DB_NAME || 'httt',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '', // Default XAMPP password thường là rỗng
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
};
