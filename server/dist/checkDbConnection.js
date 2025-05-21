"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("./config");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Nạp biến môi trường từ file .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// Hiển thị thông tin kết nối
console.log('=== KIỂM TRA KẾT NỐI DATABASE MYSQL ===');
console.log('Cấu hình kết nối:');
console.log(`- Host: ${config_1.config.dbConfig.host}`);
console.log(`- Port: ${config_1.config.dbConfig.port}`);
console.log(`- Database: ${config_1.config.dbConfig.database}`);
console.log(`- User: ${config_1.config.dbConfig.user}`);
// Thử kết nối
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('\nĐang kết nối đến MySQL...');
            const connection = yield promise_1.default.createConnection({
                host: config_1.config.dbConfig.host,
                port: config_1.config.dbConfig.port,
                user: config_1.config.dbConfig.user,
                password: config_1.config.dbConfig.password,
                database: config_1.config.dbConfig.database
            });
            console.log('\n✅ KẾT NỐI THÀNH CÔNG!');
            console.log(`Đã kết nối đến database '${config_1.config.dbConfig.database}' trên host '${config_1.config.dbConfig.host}'`);
            // Thử truy vấn đơn giản
            console.log('\nĐang thử truy vấn đơn giản...');
            const [rows] = yield connection.execute('SELECT version() AS version');
            if (Array.isArray(rows) && rows.length > 0) {
                console.log('Phiên bản MySQL:', rows[0].version);
            }
            // Đóng kết nối
            yield connection.end();
            console.log('\nĐã đóng kết nối.');
            console.log('Bạn có thể chạy server bình thường.');
            return true;
        }
        catch (err) {
            console.error('\n❌ LỖI KẾT NỐI!');
            console.error('Chi tiết lỗi:', err.message);
            // Phân tích và hiển thị gợi ý
            if (err.message.includes('Access denied')) {
                console.error('\nLỖI XÁC THỰC:');
                console.error('- Kiểm tra tên người dùng và mật khẩu');
                console.error(`- Tài khoản hiện tại: ${config_1.config.dbConfig.user}`);
            }
            else if (err.message.includes('connect ECONNREFUSED')) {
                console.error('\nKHÔNG THỂ KẾT NỐI ĐẾN SERVER:');
                console.error('- Đảm bảo MySQL đang chạy trên XAMPP');
                console.error('- Kiểm tra host và port');
                console.error('- Mở XAMPP Control Panel và đảm bảo MySQL Service đang hoạt động');
            }
            else if (err.message.includes('database') || err.message.includes('Database')) {
                console.error('\nLỖI DATABASE:');
                console.error('- Kiểm tra tên database có tồn tại');
                console.error('- Tạo database nếu chưa tồn tại: CREATE DATABASE pharmacy_db');
            }
            console.error('\nGỢI Ý FIX LỖI:');
            console.error('1. Kiểm tra XAMPP đang chạy và dịch vụ MySQL đã được khởi động');
            console.error('2. Tạo database trong phpMyAdmin:');
            console.error('   - Mở trình duyệt và truy cập http://localhost/phpmyadmin');
            console.error('   - Tạo database mới có tên "pharmacy_db"');
            console.error('3. Kiểm tra lại thông tin kết nối trong file .env hoặc config.ts');
            return false;
        }
    });
}
// Thực thi kiểm tra
checkConnection()
    .then(success => {
    if (!success) {
        console.log('\nServer có thể chạy nhưng các chức năng liên quan đến database sẽ không hoạt động.');
    }
    process.exit(success ? 0 : 1);
});
