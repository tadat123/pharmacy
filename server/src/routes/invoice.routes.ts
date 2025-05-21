import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '../controllers/invoice.controller';

const router = express.Router();

// Lấy tất cả hóa đơn
router.get('/', getAllInvoices);

// Lấy chi tiết hóa đơn theo ID
router.get('/:id', getInvoiceById);

// Tạo hóa đơn mới
router.post('/', createInvoice);

// Cập nhật hóa đơn
router.put('/:id', updateInvoice);

// Xóa hóa đơn
router.delete('/:id', deleteInvoice);

export default router; 