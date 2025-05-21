import mysql from 'mysql2/promise';
import { config } from './config';

// Cờ hiệu để bật/tắt kết nối database
const DISABLE_DB_CONNECTION = false; // Đặt thành false để kích hoạt kết nối database

// Tạo pool kết nối MySQL
const pool = DISABLE_DB_CONNECTION 
  ? null 
  : mysql.createPool(config.dbConfig);

// Hiển thị thông tin kết nối
if (!DISABLE_DB_CONNECTION) {
  console.log('=======================================');
  console.log('KẾT NỐI MYSQL THÔNG QUA XAMPP:');
  console.log(`- Host: ${config.dbConfig.host}`);
  console.log(`- Port: ${config.dbConfig.port}`);
  console.log(`- Database: ${config.dbConfig.database}`);
  console.log(`- User: ${config.dbConfig.user}`);
  console.log('=======================================');
} else {
  console.log('=======================================');
  console.log('THÔNG BÁO QUAN TRỌNG:');
  console.log('Kết nối database đã bị TẮT để chạy thử nghiệm server.');
  console.log('Các API sẽ hoạt động nhưng không truy cập được database thực tế.');
  console.log('=======================================');
}

// Định nghĩa kiểu dữ liệu cho kết quả MySQL
export interface MySQLResultObject extends Record<string, any> {
  affectedRows?: number;
  insertId?: number;
  changedRows?: number;
}

// Định nghĩa kiểu dữ liệu trả về
export type QueryResult = [any[] | MySQLResultObject, mysql.FieldPacket[]];

// Kết quả giả lập
const mockQueryResult: QueryResult = [[{ affectedRows: 0, insertId: 0 }], []];

// Mock result cho MSSQL cũ
const mssqlMockResult = {
  recordset: [],
  recordsets: [],
  rowsAffected: [0]
};

// Transaction giả lập
export class MySQLTransaction {
  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    console.log('Transaction query (giả lập):', sql);
    console.log('Params:', params);
    return mockQueryResult;
  }

  async begin(): Promise<void> {
    console.log('Begin transaction (giả lập)');
  }

  async commit(): Promise<void> {
    console.log('Commit transaction (giả lập)');
  }

  async rollback(): Promise<void> {
    console.log('Rollback transaction (giả lập)');
  }
}

// Hàm thử kết nối 
const testConnection = async () => {
  if (DISABLE_DB_CONNECTION) {
    console.log('Database đã bị vô hiệu hóa. Không thực hiện kết nối thực tế.');
    return true;
  }

  try {
    console.log('Đang thử kết nối đến MySQL (XAMPP)...');
    
    // Tạo connection tạm thời để kiểm tra
    const connection = await mysql.createConnection({
      host: config.dbConfig.host,
      port: config.dbConfig.port,
      user: config.dbConfig.user,
      password: config.dbConfig.password,
      database: config.dbConfig.database
    });
    
    console.log('Kết nối thành công đến MySQL!');
    
    // Thử truy vấn đơn giản
    const [rows] = await connection.execute('SELECT version() as version');
    if (Array.isArray(rows) && rows.length > 0) {
      const version = (rows[0] as any).version;
      console.log('Phiên bản MySQL:', version || 'Không xác định');
    }
    
    // Đóng kết nối kiểm tra
    await connection.end();
    console.log('Đã đóng kết nối kiểm tra.');
    return true;
    
  } catch (err) {
    console.error('Lỗi kết nối đến MySQL:', err);
    console.error('Vui lòng kiểm tra XAMPP đã được khởi động và MySQL đang chạy.');
    console.error('Gợi ý: Kiểm tra Control Panel của XAMPP và đảm bảo MySQL Service đang hoạt động.');
    return false;
  }
};

// Hàm thực thi query
const executeQuery = async (query: string, params: any[] = []): Promise<QueryResult> => {
  if (DISABLE_DB_CONNECTION) {
    console.log('Query giả lập:', query);
    console.log('Params:', params);
    return mockQueryResult;
  }
  
  try {
    if (!pool) {
      throw new Error('Pool kết nối không tồn tại. Kiểm tra lại cấu hình kết nối.');
    }
    
    // Execute query với prepared statement
    return await pool.execute(query, params);
    
  } catch (err) {
    console.error('Lỗi khi thực thi query:', err);
    throw err;
  }
};

// Tương thích với mssql cũ
export const sql = {
  Int: (value: any) => value,
  NVarChar: (size: number) => (value: string) => value,
  Decimal: (p: number, s: number) => (value: number) => value,
  Date: (value: Date) => value,
  Transaction: function(pool: any) {
    return new MySQLTransaction();
  },
  Request: function(transaction?: any) {
    return {
      input: function(paramName: string, type: any, value: any) {
        return this;
      },
      query: async function(query: string): Promise<any> {
        console.log('MSSQL compatible query (giả lập):', query);
        return mssqlMockResult;
      }
    };
  }
};

// Tương thích với mssql cũ
export const poolPromise = Promise.resolve({
  request: () => {
    return {
      input: (paramName: string, type: any, value: any) => {
        return {
          query: async (query: string) => {
            console.log('MSSQL poolPromise query (giả lập):', query);
            return mssqlMockResult;
          }
        };
      },
      query: async (query: string) => {
        console.log('MSSQL poolPromise query (giả lập):', query);
        return mssqlMockResult;
      }
    };
  }
});

// Chạy kiểm tra kết nối lúc khởi động nếu không bị vô hiệu hóa
if (!DISABLE_DB_CONNECTION) {
  testConnection().then(isConnected => {
    if (!isConnected) {
      console.log('Server sẽ chạy nhưng các chức năng database có thể không hoạt động.');
    }
  });
}

export { pool, executeQuery, testConnection }; 