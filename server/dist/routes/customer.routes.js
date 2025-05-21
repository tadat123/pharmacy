"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("../controllers/customer.controller");
const router = express_1.default.Router();
// Lấy tất cả khách hàng
router.get('/', customer_controller_1.getAllCustomers);
// Lấy khách hàng theo ID
router.get('/:id', customer_controller_1.getCustomerById);
// Tìm kiếm khách hàng theo SĐT
router.get('/search/phone/:phone', customer_controller_1.searchCustomerByPhone);
// Thêm khách hàng mới
router.post('/', customer_controller_1.createCustomer);
// Cập nhật thông tin khách hàng
router.put('/:id', customer_controller_1.updateCustomer);
// Xóa khách hàng
router.delete('/:id', customer_controller_1.deleteCustomer);
exports.default = router;
