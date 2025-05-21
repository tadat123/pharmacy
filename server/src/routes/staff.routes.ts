import express from 'express';
import {
  getAllStaff,
  getStaffById,
  login,
  createStaff,
  updateStaff,
  deleteStaff
} from '../controllers/staff.controller';

const router = express.Router();

// Đăng nhập
router.post('/login', login);

// Lấy tất cả nhân viên
router.get('/', getAllStaff);

// Lấy nhân viên theo ID
router.get('/:id', getStaffById);

// Thêm nhân viên mới
router.post('/', createStaff);

// Cập nhật thông tin nhân viên
router.put('/:id', updateStaff);

// Xóa nhân viên
router.delete('/:id', deleteStaff);

export default router; 