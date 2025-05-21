import express from 'express';
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine
} from '../controllers/medicine.controller';

const router = express.Router();

// Lấy tất cả thuốc
router.get('/', getAllMedicines);

// Lấy chi tiết thuốc theo ID
router.get('/:id', getMedicineById);

// Thêm thuốc mới
router.post('/', createMedicine);

// Cập nhật thông tin thuốc
router.put('/:id', updateMedicine);

// Xóa thuốc
router.delete('/:id', deleteMedicine);

export default router; 