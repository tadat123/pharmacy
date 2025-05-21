"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staff_controller_1 = require("../controllers/staff.controller");
const router = express_1.default.Router();
// Đăng nhập
router.post('/login', staff_controller_1.login);
// Lấy tất cả nhân viên
router.get('/', staff_controller_1.getAllStaff);
// Lấy nhân viên theo ID
router.get('/:id', staff_controller_1.getStaffById);
// Thêm nhân viên mới
router.post('/', staff_controller_1.createStaff);
// Cập nhật thông tin nhân viên
router.put('/:id', staff_controller_1.updateStaff);
// Xóa nhân viên
router.delete('/:id', staff_controller_1.deleteStaff);
exports.default = router;
