"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
