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
exports.deleteMedicine = exports.updateMedicine = exports.createMedicine = exports.getMedicineById = exports.getAllMedicines = void 0;
const db_1 = require("../db");
// Hàm kiểm tra xem result có phải là MySQLResultObject không
function isMySQLResult(result) {
    return result &&
        (typeof result === 'object') &&
        ('affectedRows' in result || 'insertId' in result || 'changedRows' in result);
}
// Lấy tất cả thuốc
const getAllMedicines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM Thuoc', []);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách thuốc:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách thuốc' });
    }
});
exports.getAllMedicines = getAllMedicines;
// Lấy chi tiết thuốc theo ID
const getMedicineById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM Thuoc WHERE MaThuoc = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json(rows[0]);
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy thuốc' });
        }
    }
    catch (error) {
        console.error('Lỗi khi lấy chi tiết thuốc:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy chi tiết thuốc' });
    }
});
exports.getMedicineById = getMedicineById;
// Thêm thuốc mới
const createMedicine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa } = req.body;
    try {
        const [result] = yield (0, db_1.executeQuery)(`INSERT INTO Thuoc (TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa]);
        // Lấy ID của bản ghi vừa thêm
        if (isMySQLResult(result) && result.insertId) {
            const insertId = result.insertId;
            // Lấy thông tin thuốc vừa thêm
            const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM Thuoc WHERE MaThuoc = ?', [insertId]);
            if (Array.isArray(rows) && rows.length > 0) {
                res.status(201).json(rows[0]);
            }
            else {
                res.status(201).json(Object.assign({ id: insertId }, req.body));
            }
        }
        else {
            res.status(201).json(Object.assign(Object.assign({}, req.body), { message: 'Thêm thuốc thành công nhưng không lấy được ID' }));
        }
    }
    catch (error) {
        console.error('Lỗi khi thêm thuốc mới:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm thuốc mới' });
    }
});
exports.createMedicine = createMedicine;
// Cập nhật thông tin thuốc
const updateMedicine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa } = req.body;
    try {
        const [result] = yield (0, db_1.executeQuery)(`UPDATE Thuoc
       SET TenThuoc = ?,
           DonVi = ?,
           HangSanXuat = ?,
           NhomThuoc = ?,
           GiaNhap = ?,
           GiaBan = ?,
           MoTa = ?
       WHERE MaThuoc = ?`, [TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa, id]);
        if (isMySQLResult(result) && result.affectedRows && result.affectedRows > 0) {
            // Lấy thông tin thuốc sau khi cập nhật
            const [rows] = yield (0, db_1.executeQuery)('SELECT * FROM Thuoc WHERE MaThuoc = ?', [id]);
            if (Array.isArray(rows) && rows.length > 0) {
                res.status(200).json(rows[0]);
            }
            else {
                res.status(200).json(Object.assign(Object.assign({}, req.body), { MaThuoc: id }));
            }
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy thuốc để cập nhật' });
        }
    }
    catch (error) {
        console.error('Lỗi khi cập nhật thuốc:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thuốc' });
    }
});
exports.updateMedicine = updateMedicine;
// Xóa thuốc
const deleteMedicine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield (0, db_1.executeQuery)('DELETE FROM Thuoc WHERE MaThuoc = ?', [id]);
        if (isMySQLResult(result) && result.affectedRows && result.affectedRows > 0) {
            res.status(200).json({ message: 'Xóa thuốc thành công' });
        }
        else {
            res.status(404).json({ message: 'Không tìm thấy thuốc để xóa' });
        }
    }
    catch (error) {
        console.error('Lỗi khi xóa thuốc:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thuốc' });
    }
});
exports.deleteMedicine = deleteMedicine;
