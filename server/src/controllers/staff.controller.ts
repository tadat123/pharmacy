import { Request, Response } from 'express';
import { executeQuery } from '../db';
import { NhanVien } from '../models/types';

// Để tắt warning trong quá trình phát triển
const DISABLE_DB_FEATURES = true;

// Lấy tất cả nhân viên
export const getAllStaff = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json([]);
  }
  
  try {
    const [rows] = await executeQuery('SELECT * FROM NhanVien', []);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách nhân viên' });
  }
};

// Lấy nhân viên theo ID
export const getStaffById = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
  }
  
  const { id } = req.params;
  
  try {
    const [rows] = await executeQuery(
      'SELECT * FROM NhanVien WHERE MaNhanVien = ?', 
      [id]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhân viên:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin nhân viên' });
  }
};

// Đăng nhập
export const login = async (req: Request, res: Response) => {
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
    const [rows] = await executeQuery(
      'SELECT * FROM NhanVien WHERE TaiKhoan = ? AND MatKhau = ?', 
      [TaiKhoan, MatKhau]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      // Không gửi mật khẩu về client
      const user = rows[0];
      delete user.MatKhau;
      
      res.status(200).json({
        message: 'Đăng nhập thành công',
        user
      });
    } else {
      res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập' });
  }
};

// Thêm nhân viên mới
export const createStaff = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    const { MatKhau, ...staffWithoutPassword } = req.body;
    return res.status(201).json({ ...staffWithoutPassword, MaNhanVien: 1 });
  }
  
  const { TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu } = req.body as NhanVien;
  
  try {
    // Kiểm tra tài khoản đã tồn tại chưa
    const [checkRows] = await executeQuery(
      'SELECT COUNT(*) as count FROM NhanVien WHERE TaiKhoan = ?', 
      [TaiKhoan]
    );
    
    if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
      return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
    }
    
    // Thêm nhân viên mới
    const [result] = await executeQuery(
      `INSERT INTO NhanVien (TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu]
    );
    
    if (result && 'insertId' in result) {
      const [newStaff] = await executeQuery(
        'SELECT * FROM NhanVien WHERE MaNhanVien = ?',
        [result.insertId]
      );
      
      if (Array.isArray(newStaff) && newStaff.length > 0) {
        // Không gửi mật khẩu về client
        const staff = newStaff[0];
        delete staff.MatKhau;
        
        res.status(201).json(staff);
      } else {
        const { MatKhau, ...staffWithoutPassword } = req.body;
        res.status(201).json({ ...staffWithoutPassword, MaNhanVien: result.insertId });
      }
    } else {
      throw new Error('Không thể thêm nhân viên mới');
    }
  } catch (error) {
    console.error('Lỗi khi thêm nhân viên mới:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm nhân viên mới' });
  }
};

// Cập nhật thông tin nhân viên
export const updateStaff = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    const { MatKhau, ...staffWithoutPassword } = req.body;
    return res.status(200).json({ ...staffWithoutPassword, MaNhanVien: req.params.id });
  }
  
  const { id } = req.params;
  const { TaiKhoan, MatKhau, HoTen, SoDienThoai, Email, ChucVu } = req.body as NhanVien;
  
  try {
    // Kiểm tra tài khoản đã tồn tại bởi nhân viên khác chưa
    const [checkRows] = await executeQuery(
      'SELECT COUNT(*) as count FROM NhanVien WHERE TaiKhoan = ? AND MaNhanVien != ?',
      [TaiKhoan, id]
    );
    
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
    } else {
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
    
    const [result] = await executeQuery(query, params);
    
    if (result && 'affectedRows' in result && result.affectedRows > 0) {
      const [updatedStaff] = await executeQuery(
        'SELECT * FROM NhanVien WHERE MaNhanVien = ?',
        [id]
      );
      
      if (Array.isArray(updatedStaff) && updatedStaff.length > 0) {
        // Không gửi mật khẩu về client
        const staff = updatedStaff[0];
        delete staff.MatKhau;
        
        res.status(200).json(staff);
      } else {
        const { MatKhau, ...staffWithoutPassword } = req.body;
        res.status(200).json({ ...staffWithoutPassword, MaNhanVien: id });
      }
    } else {
      res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân viên:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật nhân viên' });
  }
};

// Xóa nhân viên
export const deleteStaff = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json({ message: 'Xóa nhân viên thành công' });
  }
  
  const { id } = req.params;
  
  try {
    // Kiểm tra xem nhân viên có liên kết với hóa đơn không
    const [checkRows] = await executeQuery(
      'SELECT COUNT(*) as count FROM HoaDon WHERE MaNhanVien = ?',
      [id]
    );
    
    if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
      return res.status(400).json({ message: 'Không thể xóa nhân viên vì đã có hóa đơn liên kết' });
    }
    
    // Xóa nhân viên
    const [result] = await executeQuery(
      'DELETE FROM NhanVien WHERE MaNhanVien = ?',
      [id]
    );
    
    if (result && 'affectedRows' in result && result.affectedRows > 0) {
      res.status(200).json({ message: 'Xóa nhân viên thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa nhân viên' });
  }
}; 