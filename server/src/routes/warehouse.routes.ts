import express from 'express';

const router = express.Router();

// Lấy tất cả kho
router.get('/', (req, res) => {
  res.json({ message: 'GET tất cả thông tin kho' });
});

// Lấy chi tiết kho theo ID
router.get('/:id', (req, res) => {
  res.json({ message: `GET thông tin kho với ID: ${req.params.id}` });
});

// Thêm thuốc vào kho
router.post('/add', (req, res) => {
  res.json({ message: 'POST thêm thuốc vào kho', data: req.body });
});

// Cập nhật thông tin kho
router.put('/:id', (req, res) => {
  res.json({ message: `PUT cập nhật thông tin kho với ID: ${req.params.id}`, data: req.body });
});

// Xuất thuốc từ kho
router.post('/export', (req, res) => {
  res.json({ message: 'POST xuất thuốc từ kho', data: req.body });
});

export default router; 