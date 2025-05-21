"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoice_controller_1 = require("../controllers/invoice.controller");
const router = express_1.default.Router();
// Lấy tất cả hóa đơn
router.get('/', invoice_controller_1.getAllInvoices);
// Lấy chi tiết hóa đơn theo ID
router.get('/:id', invoice_controller_1.getInvoiceById);
// Tạo hóa đơn mới
router.post('/', invoice_controller_1.createInvoice);
// Xóa hóa đơn
router.delete('/:id', invoice_controller_1.deleteInvoice);
exports.default = router;
