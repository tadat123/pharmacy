import { Request, Response } from 'express';
import { executeQuery } from '../db';
import { KhachHang } from '../models/types';

// Để tắt warning trong quá trình phát triển
const DISABLE_DB_FEATURES = true;

// Lấy tất cả khách hàng
export const getAllCustomers = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json([]);
  }
  
  try {
    const [rows] = await executeQuery('SELECT * FROM KhachHang', []);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách khách hàng' });
  }
};

// Lấy khách hàng theo ID
export const getCustomerById = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
  }
  
  const { id } = req.params;
  
  try {
    const [rows] = await executeQuery(
      'SELECT * FROM KhachHang WHERE MaKhachHang = ?', 
      [id]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin khách hàng' });
  }
};

// Tìm kiếm khách hàng theo SĐT
export const searchCustomerByPhone = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(404).json({ message: 'Không tìm thấy khách hàng với số điện thoại này' });
  }
  
  const { phone } = req.params;
  
  try {
    const [rows] = await executeQuery(
      'SELECT * FROM KhachHang WHERE SoDienThoai = ?', 
      [phone]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy khách hàng với số điện thoại này' });
    }
  } catch (error) {
    console.error('Lỗi khi tìm kiếm khách hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm khách hàng' });
  }
};

// Thêm khách hàng mới
export const createCustomer = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(201).json({ ...req.body, MaKhachHang: 1 });
  }
  
  const { HoTen, SoDienThoai, DiaChi, DiemTichLuy } = req.body as KhachHang;
  
  try {
    // Kiểm tra số điện thoại đã tồn tại chưa
    const [checkRows] = await executeQuery(
      'SELECT COUNT(*) as count FROM KhachHang WHERE SoDienThoai = ?', 
      [SoDienThoai]
    );
    
    if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
      return res.status(400).json({ message: 'Số điện thoại đã được sử dụng bởi khách hàng khác' });
    }
    
    // Thêm khách hàng mới
    const [result] = await executeQuery(
      `INSERT INTO KhachHang (HoTen, SoDienThoai, DiaChi, DiemTichLuy)
       VALUES (?, ?, ?, ?)`,
      [HoTen, SoDienThoai, DiaChi, DiemTichLuy || '0']
    );
    
    if (result && 'insertId' in result) {
      const [newCustomer] = await executeQuery(
        'SELECT * FROM KhachHang WHERE MaKhachHang = ?',
        [result.insertId]
      );
      
      if (Array.isArray(newCustomer) && newCustomer.length > 0) {
        res.status(201).json(newCustomer[0]);
      } else {
        res.status(201).json({ ...req.body, MaKhachHang: result.insertId });
      }
    } else {
      throw new Error('Không thể thêm khách hàng mới');
    }
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng mới:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm khách hàng mới' });
  }
};

// Cập nhật thông tin khách hàng
export const updateCustomer = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json({ ...req.body, MaKhachHang: req.params.id });
  }
  
  const { id } = req.params;
  const { HoTen, SoDienThoai, DiaChi, DiemTichLuy } = req.body as KhachHang;
  
  try {
    // Kiểm tra số điện thoại đã tồn tại bởi khách hàng khác chưa
    const [checkRows] = await executeQuery(
      'SELECT COUNT(*) as count FROM KhachHang WHERE SoDienThoai = ? AND MaKhachHang != ?',
      [SoDienThoai, id]
    );
    
    if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
      return res.status(400).json({ message: 'Số điện thoại đã được sử dụng bởi khách hàng khác' });
    }
    
    // Cập nhật khách hàng
    const [result] = await executeQuery(
      `UPDATE KhachHang
       SET HoTen = ?,
           SoDienThoai = ?,
           DiaChi = ?,
           DiemTichLuy = ?
       WHERE MaKhachHang = ?`,
      [HoTen, SoDienThoai, DiaChi, DiemTichLuy, id]
    );
    
    if (result && 'affectedRows' in result && result.affectedRows > 0) {
      const [updatedCustomer] = await executeQuery(
        'SELECT * FROM KhachHang WHERE MaKhachHang = ?',
        [id]
      );
      
      if (Array.isArray(updatedCustomer) && updatedCustomer.length > 0) {
        res.status(200).json(updatedCustomer[0]);
      } else {
        res.status(200).json({ ...req.body, MaKhachHang: id });
      }
    } else {
      res.status(404).json({ message: 'Không tìm thấy khách hàng để cập nhật' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật khách hàng' });
  }
};

// Xóa khách hàng
export const deleteCustomer = async (req: Request, res: Response) => {
  if (DISABLE_DB_FEATURES) {
    return res.status(200).json({ message: 'Xóa khách hàng thành công' });
  }
  
  const { id } = req.params;
  
  try {
    // Kiểm tra xem khách hàng có liên kết với hóa đơn không
    const [checkRows] = await executeQuery(
      'SELECT COUNT(*) as count FROM HoaDon WHERE MaKhachHang = ?',
      [id]
    );
    
    if (Array.isArray(checkRows) && checkRows.length > 0 && checkRows[0].count > 0) {
      return res.status(400).json({ message: 'Không thể xóa khách hàng vì đã có hóa đơn liên kết' });
    }
    
    // Xóa khách hàng
    const [result] = await executeQuery(
      'DELETE FROM KhachHang WHERE MaKhachHang = ?',
      [id]
    );
    
    if (result && 'affectedRows' in result && result.affectedRows > 0) {
      res.status(200).json({ message: 'Xóa khách hàng thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy khách hàng để xóa' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa khách hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa khách hàng' });
  }
}; 