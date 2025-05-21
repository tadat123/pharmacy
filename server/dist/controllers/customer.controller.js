"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.searchCustomerByPhone = exports.getCustomerById = exports.getAllCustomers = void 0;
const db_1 = require("../db");
// Để tắt warning trong quá trình phát triển
const DISABLE_DB_FEATURES = true;
// Lấy tất cả khách hàng
const getAllCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json([]);
    }
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM KhachHang', []);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách khách hàng' });
    }
});
exports.getAllCustomers = getAllCustomers;
// Lấy khách hàng theo ID
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    const { id } = req.params;
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM KhachHang WHERE MaKhachHang = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json(rows[0]);
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        }
    }
    catch (error) {
        console.error('Lỗi khi lấy thông tin khách hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin khách hàng' });
    }
});
exports.getCustomerById = getCustomerById;
// Tìm kiếm khách hàng theo SĐT
const searchCustomerByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng với số điện thoại này' });
    }
    const { phone } = req.params;
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM KhachHang WHERE SoDienThoai = ?', [phone]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json(rows[0]);
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy khách hàng với số điện thoại này' });
        }
    }
    catch (error) {
        console.error('Lỗi khi tìm kiếm khách hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm khách hàng' });
    }
});
exports.searchCustomerByPhone = searchCustomerByPhone;
// Thêm khách hàng mới
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(201).json(Object.assign(Object.assign({}, req.body), { MaKhachHang: 1 }));
    }
    const { HoTen, SoDienThoai, DiaChi, DiemTichLuy } = req.body;
    try {
        // Kiểm tra số điện thoại đã tồn tại chưa
        const [checkRows] = yield (0, db_1.executeQuery)('SELECT COUNT(*) as count FROM KhachHang WHERE SoDienThoai = ?', [SoDienThoai]);
        if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
            return res.status(400).json({ message: 'Số điện thoại đã được sử dụng bởi khách hàng khác' });
        }
        // Thêm khách hàng mới
        const [result] = yield (0, db_1.executeQuery)(`INSERT INTO KhachHang (HoTen, SoDienThoai, DiaChi, DiemTichLuy)
       VALUES (?, ?, ?, ?)`, [HoTen, SoDienThoai, DiaChi, DiemTichLuy || '0']);
        if (result && 'insertId' in result) {
            const [newCustomer] = yield (0, db_1.executeQuery)('SELECT * FROM KhachHang WHERE MaKhachHang = ?', [result.insertId]);
            if (Array.isArray(newCustomer) && newCustomer.length > 0) {
                res.status(201).json(newCustomer[0]);
            }
            else {
                res.status(201).json(Object.assign(Object.assign({}, req.body), { MaKhachHang: result.insertId }));
            }
        }
        else {
            throw new Error('Không thể thêm khách hàng mới');
        }
    }
    catch (error) {
        console.error('Lỗi khi thêm khách hàng mới:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm khách hàng mới' });
    }
});
exports.createCustomer = createCustomer;
// Cập nhật thông tin khách hàng
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json(Object.assign(Object.assign({}, req.body), { MaKhachHang: req.params.id }));
    }
    const { id } = req.params;
    const { HoTen, SoDienThoai, DiaChi, DiemTichLuy } = req.body;
    try {
        // Kiểm tra số điện thoại đã tồn tại bởi khách hàng khác chưa
        const [checkRows] = yield (0, db_1.executeQuery)('SELECT COUNT(*) as count FROM KhachHang WHERE SoDienThoai = ? AND MaKhachHang != ?', [SoDienThoai, id]);
        if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
            return res.status(400).json({ message: 'Số điện thoại đã được sử dụng bởi khách hàng khác' });
        }
        // Cập nhật khách hàng
        const [result] = yield (0, db_1.executeQuery)(`UPDATE KhachHang
       SET HoTen = ?,
           SoDienThoai = ?,
           DiaChi = ?,
           DiemTichLuy = ?
       WHERE MaKhachHang = ?`, [HoTen, SoDienThoai, DiaChi, DiemTichLuy, id]);
        if (result && 'affectedRows' in result && result.affectedRows > 0) {
            const [updatedCustomer] = yield (0, db_1.executeQuery)('SELECT * FROM KhachHang WHERE MaKhachHang = ?', [id]);
            if (Array.isArray(updatedCustomer) && updatedCustomer.length > 0) {
                res.status(200).json(updatedCustomer[0]);
            }
            else {
                res.status(200).json(Object.assign(Object.assign({}, req.body), { MaKhachHang: id }));
            }
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy khách hàng để cập nhật' });
        }
    }
    catch (error) {
        console.error('Lỗi khi cập nhật khách hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật khách hàng' });
    }
});
exports.updateCustomer = updateCustomer;
// Xóa khách hàng
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json({ message: 'Xóa khách hàng thành công' });
    }
    const { id } = req.params;
    try {
        // Kiểm tra xem khách hàng có liên kết với hóa đơn không
        const [checkRows] = yield (0, db_1.executeQuery)('SELECT COUNT(*) as count FROM HoaDon WHERE MaKhachHang = ?', [id]);
        if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
            return res.status(400).json({ message: 'Không thể xóa khách hàng vì đã có hóa đơn liên kết' });
        }
        // Xóa khách hàng
        const [result] = yield (0, db_1.executeQuery)('DELETE FROM KhachHang WHERE MaKhachHang = ?', [id]);
        if (result && 'affectedRows' in result && result.affectedRows > 0) {
            res.status(200).json({ message: 'Xóa khách hàng thành công' });
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy khách hàng để xóa' });
        }
    }
    catch (error) {
        console.error('Lỗi khi xóa khách hàng:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa khách hàng' });
    }
});
exports.deleteCustomer = deleteCustomer;
