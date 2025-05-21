"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Lấy tất cả nhà cung cấp
router.get('/', (req, res) => {
    res.json({ message: 'GET tất cả nhà cung cấp' });
});
// Lấy chi tiết nhà cung cấp theo ID
router.get('/:id', (req, res) => {
    res.json({ message: `GET nhà cung cấp với ID: ${req.params.id}` });
});
// Thêm nhà cung cấp mới
router.post('/', (req, res) => {
    res.json({ message: 'POST thêm nhà cung cấp mới', data: req.body });
});
// Cập nhật thông tin nhà cung cấp
router.put('/:id', (req, res) => {
    res.json({ message: `PUT cập nhật nhà cung cấp với ID: ${req.params.id}`, data: req.body });
});
// Xóa nhà cung cấp
router.delete('/:id', (req, res) => {
    res.json({ message: `DELETE nhà cung cấp với ID: ${req.params.id}` });
});
exports.default = router;
