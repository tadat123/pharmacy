"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
require("./db"); // Kết nối đến cơ sở dữ liệu
// Routes
const medicine_routes_1 = __importDefault(require("./routes/medicine.routes"));
const invoice_routes_1 = __importDefault(require("./routes/invoice.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const staff_routes_1 = __importDefault(require("./routes/staff.routes"));
const warehouse_routes_1 = __importDefault(require("./routes/warehouse.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/medicines', medicine_routes_1.default);
app.use('/api/invoices', invoice_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/suppliers', supplier_routes_1.default);
app.use('/api/staff', staff_routes_1.default);
app.use('/api/warehouse', warehouse_routes_1.default);
// Route cơ bản
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến API quản lý nhà thuốc' });
});
// Khởi động server
const PORT = config_1.config.port;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
