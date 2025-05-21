import mysql from 'mysql2/promise';
import { config } from './config';
import dotenv from 'dotenv';
import path from 'path';

// Nạp biến môi trường từ file .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Hiển thị thông tin kết nối
console.log('=== KIỂM TRA KẾT NỐI DATABASE MYSQL ===');
console.log('Cấu hình kết nối:');
console.log(`- Host: ${config.dbConfig.host}`);
console.log(`- Port: ${config.dbConfig.port}`);
console.log(`- Database: ${config.dbConfig.database}`);
console.log(`- User: ${config.dbConfig.user}`);

// Thử kết nối
async function checkConnection() {
  try {
    console.log('\nĐang kết nối đến MySQL...');
    
    const connection = await mysql.createConnection({
      host: config.dbConfig.host,
      port: config.dbConfig.port,
      user: config.dbConfig.user,
      password: config.dbConfig.password,
      database: config.dbConfig.database
    });
    
    console.log('\n✅ KẾT NỐI THÀNH CÔNG!');
    console.log(`Đã kết nối đến database '${config.dbConfig.database}' trên host '${config.dbConfig.host}'`);
    
    // Thử truy vấn đơn giản
    console.log('\nĐang thử truy vấn đơn giản...');
    const [rows] = await connection.execute('SELECT version() AS version');
    if (Array.isArray(rows) && rows.length > 0) {
      console.log('Phiên bản MySQL:', (rows[0] as any).version);
    }
    
    // Đóng kết nối
    await connection.end();
    console.log('\nĐã đóng kết nối.');
    console.log('Bạn có thể chạy server bình thường.');
    
    return true;
  } catch (err: any) {
    console.error('\n❌ LỖI KẾT NỐI!');
    console.error('Chi tiết lỗi:', err.message);
    
    // Phân tích và hiển thị gợi ý
    if (err.message.includes('Access denied')) {
      console.error('\nLỖI XÁC THỰC:');
      console.error('- Kiểm tra tên người dùng và mật khẩu');
      console.error(`- Tài khoản hiện tại: ${config.dbConfig.user}`);
    } else if (err.message.includes('connect ECONNREFUSED')) {
      console.error('\nKHÔNG THỂ KẾT NỐI ĐẾN SERVER:');
      console.error('- Đảm bảo MySQL đang chạy trên XAMPP');
      console.error('- Kiểm tra host và port');
      console.error('- Mở XAMPP Control Panel và đảm bảo MySQL Service đang hoạt động');
    } else if (err.message.includes('database') || err.message.includes('Database')) {
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
}

// Thực thi kiểm tra
checkConnection()
  .then(success => {
    if (!success) {
      console.log('\nServer có thể chạy nhưng các chức năng liên quan đến database sẽ không hoạt động.');
    }
    process.exit(success ? 0 : 1);
  }); 