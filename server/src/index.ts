import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from './config';
import './db'; // Kết nối đến cơ sở dữ liệu

// Routes
import medicineRoutes from './routes/medicine.routes';
import invoiceRoutes from './routes/invoice.routes';
import customerRoutes from './routes/customer.routes';
import supplierRoutes from './routes/supplier.routes';
import staffRoutes from './routes/staff.routes';
import warehouseRoutes from './routes/warehouse.routes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/warehouse', warehouseRoutes);

// Route cơ bản
app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng đến API quản lý nhà thuốc' });
});

// Khởi động server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
}); 