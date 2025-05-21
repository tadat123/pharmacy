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
exports.deleteInvoice = exports.createInvoice = exports.getInvoiceById = exports.getAllInvoices = void 0;
const db_1 = require("../db");
// Để tắt warning trong quá trình phát triển
const DISABLE_DB_FEATURES = true;
// Lấy tất cả hóa đơn
const getAllInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json([]);
    }
    try {
        const [rows] = yield (0, db_1.executeQuery)(`
      SELECT hd.*, kh.HoTen as TenKhachHang, nv.HoTen as TenNhanVien
      FROM HoaDon hd
      LEFT JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
      LEFT JOIN NhanVien nv ON hd.MaNhanVien = nv.MaNhanVien
      ORDER BY hd.NgayLap DESC
    `, []);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách hóa đơn:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn' });
    }
});
exports.getAllInvoices = getAllInvoices;
// Lấy chi tiết hóa đơn theo ID
const getInvoiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }
    const { id } = req.params;
    try {
        // Lấy thông tin hóa đơn
        const [invoiceRows] = yield (0, db_1.executeQuery)(`
      SELECT hd.*, kh.HoTen as TenKhachHang, nv.HoTen as TenNhanVien
      FROM HoaDon hd
      LEFT JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
      LEFT JOIN NhanVien nv ON hd.MaNhanVien = nv.MaNhanVien
      WHERE hd.MaHoaDon = ?
    `, [id]);
        if (!Array.isArray(invoiceRows) || invoiceRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        }
        // Lấy chi tiết hóa đơn
        const [detailsRows] = yield (0, db_1.executeQuery)(`
      SELECT cthd.*, t.TenThuoc
      FROM ChiTietHoaDon cthd
      JOIN Thuoc t ON cthd.MaThuoc = t.MaThuoc
      WHERE cthd.MaHoaDon = ?
    `, [id]);
        res.status(200).json({
            hoaDon: Array.isArray(invoiceRows) ? invoiceRows[0] : null,
            chiTietHoaDon: Array.isArray(detailsRows) ? detailsRows : []
        });
    }
    catch (error) {
        console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy chi tiết hóa đơn' });
    }
});
exports.getInvoiceById = getInvoiceById;
// Tạo hóa đơn mới
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(201).json({
            message: 'Tạo hóa đơn thành công (giả lập)',
            hoaDon: Object.assign({ MaHoaDon: 1 }, req.body)
        });
    }
    const { MaNhanVien, MaKhachHang, NgayLap, TongTien, ChiTietHoaDon } = req.body;
    try {
        // Trong MySQL sẽ cần xử lý transaction theo cách khác
        // Đây là code giả lập
        // Thêm hóa đơn
        const [invoiceResult] = yield (0, db_1.executeQuery)(`
      INSERT INTO HoaDon (MaNhanVien, MaKhachHang, NgayLap, TongTien)
      VALUES (?, ?, ?, ?)
    `, [MaNhanVien, MaKhachHang || null, NgayLap, TongTien]);
        if (!invoiceResult || !('insertId' in invoiceResult)) {
            throw new Error('Không thể tạo hóa đơn');
        }
        const maHoaDon = invoiceResult.insertId;
        // Thêm chi tiết hóa đơn
        for (const chiTiet of ChiTietHoaDon) {
            yield (0, db_1.executeQuery)(`
        INSERT INTO ChiTietHoaDon (MaHoaDon, MaThuoc, SoLuong, DonGia, ThanhTien)
        VALUES (?, ?, ?, ?, ?)
      `, [maHoaDon, chiTiet.MaThuoc, chiTiet.SoLuong, chiTiet.DonGia, chiTiet.ThanhTien]);
        }
        // Lấy hóa đơn vừa tạo
        const [hoaDonRows] = yield (0, db_1.executeQuery)(`
      SELECT * FROM HoaDon WHERE MaHoaDon = ?
    `, [maHoaDon]);
        // Trả về kết quả
        res.status(201).json({
            message: 'Tạo hóa đơn thành công',
            hoaDon: Array.isArray(hoaDonRows) && hoaDonRows.length > 0 ? hoaDonRows[0] : { MaHoaDon: maHoaDon }
        });
    }
    catch (error) {
        console.error('Lỗi khi tạo hóa đơn mới:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo hóa đơn mới' });
    }
});
exports.createInvoice = createInvoice;
// Xóa hóa đơn
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (DISABLE_DB_FEATURES) {
        return res.status(200).json({ message: 'Xóa hóa đơn thành công (giả lập)' });
    }
    const { id } = req.params;
    try {
        // Xóa chi tiết hóa đơn
        yield (0, db_1.executeQuery)(`
      DELETE FROM ChiTietHoaDon WHERE MaHoaDon = ?
    `, [id]);
        // Xóa hóa đơn
        const [deleteResult] = yield (0, db_1.executeQuery)(`
      DELETE FROM HoaDon WHERE MaHoaDon = ?
    `, [id]);
        if (deleteResult && 'affectedRows' in deleteResult && deleteResult.affectedRows > 0) {
            res.status(200).json({ message: 'Xóa hóa đơn thành công' });
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy hóa đơn để xóa' });
        }
    }
    catch (error) {
        console.error('Lỗi khi xóa hóa đơn:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa hóa đơn' });
    }
});
exports.deleteInvoice = deleteInvoice;
