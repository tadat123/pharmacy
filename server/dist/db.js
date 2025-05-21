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
exports.testConnection = exports.executeQuery = exports.pool = exports.poolPromise = exports.sql = exports.MySQLTransaction = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("./config");
// Cờ hiệu để bật/tắt kết nối database
const DISABLE_DB_CONNECTION = true; // Đặt thành true để vô hiệu hóa kết nối database
// Tạo pool kết nối MySQL
const pool = DISABLE_DB_CONNECTION
    ? null
    : promise_1.default.createPool(config_1.config.dbConfig);
exports.pool = pool;
// Hiển thị thông tin kết nối
if (!DISABLE_DB_CONNECTION) {
    console.log('=======================================');
    console.log('KẾT NỐI MYSQL THÔNG QUA XAMPP:');
    console.log(`- Host: ${config_1.config.dbConfig.host}`);
    console.log(`- Port: ${config_1.config.dbConfig.port}`);
    console.log(`- Database: ${config_1.config.dbConfig.database}`);
    console.log(`- User: ${config_1.config.dbConfig.user}`);
    console.log('=======================================');
}
else {
    console.log('=======================================');
    console.log('THÔNG BÁO QUAN TRỌNG:');
    console.log('Kết nối database đã bị TẮT để chạy thử nghiệm server.');
    console.log('Các API sẽ hoạt động nhưng không truy cập được database thực tế.');
    console.log('=======================================');
}
// Kết quả giả lập
const mockQueryResult = [[{ affectedRows: 0, insertId: 0 }], []];
// Mock result cho MSSQL cũ
const mssqlMockResult = {
    recordset: [],
    recordsets: [],
    rowsAffected: [0]
};
// Transaction giả lập
class MySQLTransaction {
    query(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, params = []) {
            console.log('Transaction query (giả lập):', sql);
            console.log('Params:', params);
            return mockQueryResult;
        });
    }
    begin() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Begin transaction (giả lập)');
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Commit transaction (giả lập)');
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Rollback transaction (giả lập)');
        });
    }
}
exports.MySQLTransaction = MySQLTransaction;
// Hàm thử kết nối 
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_CONNECTION) {
        console.log('Database đã bị vô hiệu hóa. Không thực hiện kết nối thực tế.');
        return true;
    }
    try {
        console.log('Đang thử kết nối đến MySQL (XAMPP)...');
        // Tạo connection tạm thời để kiểm tra
        const connection = yield promise_1.default.createConnection({
            host: config_1.config.dbConfig.host,
            port: config_1.config.dbConfig.port,
            user: config_1.config.dbConfig.user,
            password: config_1.config.dbConfig.password,
            database: config_1.config.dbConfig.database
        });
        console.log('Kết nối thành công đến MySQL!');
        // Thử truy vấn đơn giản
        const [rows] = yield connection.execute('SELECT version() as version');
        if (Array.isArray(rows) && rows.length > 0) {
            const version = rows[0].version;
            console.log('Phiên bản MySQL:', version || 'Không xác định');
        }
        // Đóng kết nối kiểm tra
        yield connection.end();
        console.log('Đã đóng kết nối kiểm tra.');
        return true;
    }
    catch (err) {
        console.error('Lỗi kết nối đến MySQL:', err);
        console.error('Vui lòng kiểm tra XAMPP đã được khởi động và MySQL đang chạy.');
        console.error('Gợi ý: Kiểm tra Control Panel của XAMPP và đảm bảo MySQL Service đang hoạt động.');
        return false;
    }
});
exports.testConnection = testConnection;
// Hàm thực thi query
const executeQuery = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, params = []) {
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
        return yield pool.execute(query, params);
    }
    catch (err) {
        console.error('Lỗi khi thực thi query:', err);
        throw err;
    }
});
exports.executeQuery = executeQuery;
// Tương thích với mssql cũ
exports.sql = {
    Int: (value) => value,
    NVarChar: (size) => (value) => value,
    Decimal: (p, s) => (value) => value,
    Date: (value) => value,
    Transaction: function (pool) {
        return new MySQLTransaction();
    },
    Request: function (transaction) {
        return {
            input: function (paramName, type, value) {
                return this;
            },
            query: function (query) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('MSSQL compatible query (giả lập):', query);
                    return mssqlMockResult;
                });
            }
        };
    }
};
// Tương thích với mssql cũ
exports.poolPromise = Promise.resolve({
    request: () => {
        return {
            input: (paramName, type, value) => {
                return {
                    query: (query) => __awaiter(void 0, void 0, void 0, function* () {
                        console.log('MSSQL poolPromise query (giả lập):', query);
                        return mssqlMockResult;
                    })
                };
            },
            query: (query) => __awaiter(void 0, void 0, void 0, function* () {
                console.log('MSSQL poolPromise query (giả lập):', query);
                return mssqlMockResult;
            })
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
