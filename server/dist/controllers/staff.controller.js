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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.login = exports.getStaffById = exports.getAllStaff = void 0;
const db_1 = require("../db");
// Để tắt warning trong quá trình phát triển
const DISABLE_DB_FEATURES = true;
// Lấy tất cả nhân viên
const getAllStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json([]);
    }
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM NhanVien', []);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách nhân viên' });
    }
});
exports.getAllStaff = getAllStaff;
// Lấy nhân viên theo ID
const getStaffById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    const { id } = req.params;
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM NhanVien WHERE MaNhanVien = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json(rows[0]);
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }
    }
    catch (error) {
        console.error('Lỗi khi lấy thông tin nhân viên:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin nhân viên' });
    }
});
exports.getStaffById = getStaffById;
// Đăng nhập
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json({
            message: 'Đăng nhập thành công (giả lập)',
            user: {
                MaNhanVien: 1,
                TaiKhoan: req.body.TaiKhoan,
                HoTen: 'Admin',
                ChucVu: 'Quản lý',
                Email: 'admin@example.com',
                SoDienThoai: '0123456789'
            }
        });
    }
    const { TaiKhoan, MatKhau } = req.body;
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM NhanVien WHERE TaiKhoan = ? AND MatKhau = ?', [TaiKhoan, MatKhau]);
        if (Array.isArray(rows) && rows.length > 0) {
            // Không gửi mật khẩu về client
            const user = rows[0];
            delete user.MatKhau;
            res.status(200).json({
                message: 'Đăng nhập thành công',
                user
            });
        }
        else {
            res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
        }
    }
    catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập' });
    }
});
exports.login = login;
// Thêm nhân viên mới
const createStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        const _a = req.body, { MatKhau } = _a, staffWithoutPassword = __rest(_a, ["MatKhau"]);
        return res.status(201).json(Object.assign(Object.assign({}, staffWithoutPassword), { MaNhanVien: 1 }));
    }
    const { TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu } = req.body;
    try {
        // Kiểm tra tài khoản đã tồn tại chưa
        const [checkRows] = yield (0, db_1.executeQuery)('SELECT COUNT(*) as count FROM NhanVien WHERE TaiKhoan = ?', [TaiKhoan]);
        if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        }
        // Thêm nhân viên mới
        const [result] = yield (0, db_1.executeQuery)(`INSERT INTO NhanVien (TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu)
       VALUES (?, ?, ?, ?, ?, ?)`, [TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu]);
        if (result && 'insertId' in result) {
            const [newStaff] = yield (0, db_1.executeQuery)('SELECT * FROM NhanVien WHERE MaNhanVien = ?', [result.insertId]);
            if (Array.isArray(newStaff) && newStaff.length > 0) {
                // Không gửi mật khẩu về client
                const staff = newStaff[0];
                delete staff.MatKhau;
                res.status(201).json(staff);
            }
            else {
                const _b = req.body, { MatKhau } = _b, staffWithoutPassword = __rest(_b, ["MatKhau"]);
                res.status(201).json(Object.assign(Object.assign({}, staffWithoutPassword), { MaNhanVien: result.insertId }));
            }
        }
        else {
            throw new Error('Không thể thêm nhân viên mới');
        }
    }
    catch (error) {
        console.error('Lỗi khi thêm nhân viên mới:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm nhân viên mới' });
    }
});
exports.createStaff = createStaff;
// Cập nhật thông tin nhân viên
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        const _a = req.body, { MatKhau } = _a, staffWithoutPassword = __rest(_a, ["MatKhau"]);
        return res.status(200).json(Object.assign(Object.assign({}, staffWithoutPassword), { MaNhanVien: req.params.id }));
    }
    const { id } = req.params;
    const { TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu } = req.body;
    try {
        // Kiểm tra tài khoản đã tồn tại bởi nhân viên khác chưa
        const [checkRows] = yield (0, db_1.executeQuery)('SELECT COUNT(*) as count FROM NhanVien WHERE TaiKhoan = ? AND MaNhanVien != ?', [TaiKhoan, id]);
        if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
            return res.status(400).json({ message: 'Tài khoản đã được sử dụng bởi nhân viên khác' });
        }
        // Cập nhật nhân viên
        let query, params;
        // Chỉ cập nhật mật khẩu nếu có
        if (MatKhau) {
            query = `
        UPDATE NhanVien
        SET TaiKhoan = ?,
            MatKhau = ?,
            HoTen = ?,
            SoDienThoai = ?,
            Email = ?,
            ChucVu = ?
        WHERE MaNhanVien = ?
      `;
            params = [TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu, id];
        }
        else {
            query = `
        UPDATE NhanVien
        SET TaiKhoan = ?,
            HoTen = ?,
            SoDienThoai = ?,
            Email = ?,
            ChucVu = ?
        WHERE MaNhanVien = ?
      `;
            params = [TaiKhoan, HoTen, SoDienThoai, Email, ChucVu, id];
        }
        const [result] = yield (0, db_1.executeQuery)(query, params);
        if (result && 'affectedRows' in result && result.affectedRows > 0) {
            const [updatedStaff] = yield (0, db_1.executeQuery)('SELECT * FROM NhanVien WHERE MaNhanVien = ?', [id]);
            if (Array.isArray(updatedStaff) && updatedStaff.length > 0) {
                // Không gửi mật khẩu về client
                const staff = updatedStaff[0];
                delete staff.MatKhau;
                res.status(200).json(staff);
            }
            else {
                const _b = req.body, { MatKhau } = _b, staffWithoutPassword = __rest(_b, ["MatKhau"]);
                res.status(200).json(Object.assign(Object.assign({}, staffWithoutPassword), { MaNhanVien: id }));
            }
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật' });
        }
    }
    catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật nhân viên' });
    }
});
exports.updateStaff = updateStaff;
// Xóa nhân viên
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json({ message: 'Xóa nhân viên thành công' });
    }
    const { id } = req.params;
    try {
        // Kiểm tra xem nhân viên có liên kết với hóa đơn không
        const [checkRows] = yield (0, db_1.executeQuery)('SELECT COUNT(*) as count FROM HoaDon WHERE MaNhanVien = ?', [id]);
        if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
            return res.status(400).json({ message: 'Không thể xóa nhân viên vì đã có hóa đơn liên kết' });
        }
        // Xóa nhân viên
        const [result] = yield (0, db_1.executeQuery)('DELETE FROM NhanVien WHERE MaNhanVien = ?', [id]);
        if (result && 'affectedRows' in result && result.affectedRows > 0) {
            res.status(200).json({ message: 'Xóa nhân viên thành công' });
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa' });
        }
    }
    catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa nhân viên' });
    }
});
exports.deleteStaff = deleteStaff;
