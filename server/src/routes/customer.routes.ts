import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  searchCustomerByPhone,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customer.controller';

const router = express.Router();

// Lấy tất cả khách hàng
router.get('/', getAllCustomers);

// Lấy khách hàng theo ID
router.get('/:id', getCustomerById);

// Tìm kiếm khách hàng theo SĐT
router.get('/search/phone/:phone', searchCustomerByPhone);

// Thêm khách hàng mới
router.post('/', createCustomer);

// Cập nhật thông tin khách hàng
router.put('/:id', updateCustomer);

// Xóa khách hàng
router.delete('/:id', deleteCustomer);

export default router; 