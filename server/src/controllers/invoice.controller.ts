import { Request, Response } from 'express';
import { executeQuery, sql } from '../db';
import { HoaDon, ChiTietHoaDon } from '../models/types';

// Để tắt warning trong quá trình phát triển
const DISABLE_DB_FEATURES = false;

// Lấy tất cả hóa đơn
export const getAllInvoices = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json([]);
  }
  
  try {
    const [rows] = await executeQuery(`
      SELECT hd.*, kh.HoTen as TenKhachHang, nv.HoTen as TenNhanVien
      FROM HoaDon hd
      LEFT JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
      LEFT JOIN NhanVien nv ON hd.MaNhanVien = nv.MaNhanVien
      ORDER BY hd.NgayLap DESC
    `, []);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách hóa đơn' });
  }
};

// Lấy chi tiết hóa đơn theo ID
export const getInvoiceById = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
  }
  
  const { id } = req.params;
  
  try {
    // Lấy thông tin hóa đơn
    const [invoiceRows] = await executeQuery(`
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
    const [detailsRows] = await executeQuery(`
      SELECT cthd.*, t.TenThuoc
      FROM ChiTietHoaDon cthd
      JOIN Thuoc t ON cthd.MaThuoc = t.MaThuoc
      WHERE cthd.MaHoaDon = ?
    `, [id]);
    
    res.status(200).json({
      hoaDon: Array.isArray(invoiceRows) ? invoiceRows[0] : null,
      chiTietHoaDon: Array.isArray(detailsRows) ? detailsRows : []
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy chi tiết hóa đơn' });
  }
};

// Tạo hóa đơn mới
export const createInvoice = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(201).json({
      message: 'Tạo hóa đơn thành công (giả lập)',
      hoaDon: { MaHoaDon: 1, ...req.body }
    });
  }
  
  const { MaNhanVien, MaKhachHang, NgayLap, TongTien, ChiTietHoaDon } = req.body;
  
  try {
    // Trong MySQL sẽ cần xử lý transaction theo cách khác
    // Đây là code giả lập
    
    // Thêm hóa đơn
    const [invoiceResult] = await executeQuery(`
      INSERT INTO HoaDon (MaNhanVien, MaKhachHang, NgayLap, TongTien)
      VALUES (?, ?, ?, ?)
    `, [MaNhanVien, MaKhachHang || null, NgayLap, TongTien]);
    
    if (!invoiceResult || !('insertId' in invoiceResult)) {
      throw new Error('Không thể tạo hóa đơn');
    }
    
    const maHoaDon = invoiceResult.insertId;
    
    // Thêm chi tiết hóa đơn
    for (const chiTiet of ChiTietHoaDon) {
      await executeQuery(`
        INSERT INTO ChiTietHoaDon (MaHoaDon, MaThuoc, SoLuong, DonGia, ThanhTien)
        VALUES (?, ?, ?, ?, ?)
      `, [maHoaDon, chiTiet.MaThuoc, chiTiet.SoLuong, chiTiet.DonGia, chiTiet.ThanhTien]);
    }
    
    // Lấy hóa đơn vừa tạo
    const [hoaDonRows] = await executeQuery(`
      SELECT * FROM HoaDon WHERE MaHoaDon = ?
    `, [maHoaDon]);
    
    // Trả về kết quả
    res.status(201).json({
      message: 'Tạo hóa đơn thành công',
      hoaDon: Array.isArray(hoaDonRows) && hoaDonRows.length > 0 ? hoaDonRows[0] : { MaHoaDon: maHoaDon }
    });
  } catch (error) {
    console.error('Lỗi khi tạo hóa đơn mới:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo hóa đơn mới' });
  }
};

// Xóa hóa đơn
export const deleteInvoice = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json({ message: 'Xóa hóa đơn thành công (giả lập)' });
  }
  
  const { id } = req.params;
  
  try {
    // Xóa chi tiết hóa đơn
    await executeQuery(`
      DELETE FROM ChiTietHoaDon WHERE MaHoaDon = ?
    `, [id]);
    
    // Xóa hóa đơn
    const [deleteResult] = await executeQuery(`
      DELETE FROM HoaDon WHERE MaHoaDon = ?
    `, [id]);
    
    if (deleteResult && 'affectedRows' in deleteResult && deleteResult.affectedRows > 0) {
      res.status(200).json({ message: 'Xóa hóa đơn thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy hóa đơn để xóa' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa hóa đơn:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa hóa đơn' });
  }
};

// Cập nhật hóa đơn
export const updateInvoice = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json({
      message: 'Cập nhật hóa đơn thành công (giả lập)',
      hoaDon: { ...req.body }
    });
  }
  
  const { id } = req.params;
  const { MaNhanVien, MaKhachHang, NgayLap, TongTien, GiamGia, ThanhToan } = req.body;
  
  try {
    // Cập nhật hóa đơn
    const [updateResult] = await executeQuery(`
      UPDATE HoaDon
      SET MaNhanVien = ?,
          MaKhachHang = ?,
          NgayLap = ?,
          TongTien = ?,
          GiamGia = ?,
          ThanhToan = ?
      WHERE MaHoaDon = ?
    `, [MaNhanVien, MaKhachHang || null, NgayLap, TongTien, GiamGia, ThanhToan, id]);
    
    if (updateResult && 'affectedRows' in updateResult && updateResult.affectedRows > 0) {
      // Lấy thông tin hóa đơn sau khi cập nhật
      const [hoaDonRows] = await executeQuery(`
        SELECT hd.*, kh.HoTen as TenKhachHang, nv.HoTen as TenNhanVien
        FROM HoaDon hd
        LEFT JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
        LEFT JOIN NhanVien nv ON hd.MaNhanVien = nv.MaNhanVien
        WHERE hd.MaHoaDon = ?
      `, [id]);
      
      res.status(200).json({
        message: 'Cập nhật hóa đơn thành công',
        hoaDon: Array.isArray(hoaDonRows) && hoaDonRows.length > 0 ? hoaDonRows[0] : { MaHoaDon: id, ...req.body }
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy hóa đơn để cập nhật' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật hóa đơn:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật hóa đơn' });
  }
}; 