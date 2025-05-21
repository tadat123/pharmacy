"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicine_controller_1 = require("../controllers/medicine.controller");
const router = express_1.default.Router();
// Lấy tất cả thuốc
router.get('/', medicine_controller_1.getAllMedicines);
// Lấy chi tiết thuốc theo ID
router.get('/:id', medicine_controller_1.getMedicineById);
// Thêm thuốc mới
router.post('/', medicine_controller_1.createMedicine);
// Cập nhật thông tin thuốc
router.put('/:id', medicine_controller_1.updateMedicine);
// Xóa thuốc
router.delete('/:id', medicine_controller_1.deleteMedicine);
exports.default = router;
