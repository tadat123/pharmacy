import { Request, Response } from 'express';
import { pool, executeQuery, MySQLResultObject } from '../db';
import { Thuoc } from '../models/types';

// Hàm kiểm tra xem result có phải là MySQLResultObject không
function isMySQLResult(result: any): result is MySQLResultObject {
  return result && 
    (typeof result === 'object') && 
    ('affectedRows' in result || 'insertId' in result || 'changedRows' in result);
}

// Lấy tất cả thuốc
export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const [rows] = await executeQuery('SELECT * FROM Thuoc', []);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thuốc:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách thuốc' });
  }
};

// Lấy chi tiết thuốc theo ID
export const getMedicineById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const [rows] = await executeQuery(
      'SELECT * FROM Thuoc WHERE MaThuoc = ?', 
      [id]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy thuốc' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết thuốc:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy chi tiết thuốc' });
  }
};

// Thêm thuốc mới
export const createMedicine = async (req: Request, res: Response) => {
  const { TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa } = req.body as Thuoc;
  
  try {
    const [result] = await executeQuery(
      `INSERT INTO Thuoc (TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa]
    );
    
    // Lấy ID của bản ghi vừa thêm
    if (isMySQLResult(result) && result.insertId) {
      const insertId = result.insertId;
      
      // Lấy thông tin thuốc vừa thêm
      const [rows] = await executeQuery(
        'SELECT * FROM Thuoc WHERE MaThuoc = ?',
        [insertId]
      );
      
      if (Array.isArray(rows) && rows.length > 0) {
        res.status(201).json(rows[0]);
      } else {
        res.status(201).json({ id: insertId, ...req.body });
      }
    } else {
      res.status(201).json({ ...req.body, message: 'Thêm thuốc thành công nhưng không lấy được ID' });
    }
  } catch (error) {
    console.error('Lỗi khi thêm thuốc mới:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm thuốc mới' });
  }
};

// Cập nhật thông tin thuốc
export const updateMedicine = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa } = req.body as Thuoc;
  
  try {
    const [result] = await executeQuery(
      `UPDATE Thuoc
       SET TenThuoc = ?,
           DonVi = ?,
           HangSanXuat = ?,
           NhomThuoc = ?,
           GiaNhap = ?,
           GiaBan = ?,
           MoTa = ?
       WHERE MaThuoc = ?`,
      [TenThuoc, DonVi, HangSanXuat, NhomThuoc, GiaNhap, GiaBan, MoTa, id]
    );
    
    if (isMySQLResult(result) && result.affectedRows && result.affectedRows > 0) {
      // Lấy thông tin thuốc sau khi cập nhật
      const [rows] = await executeQuery(
        'SELECT * FROM Thuoc WHERE MaThuoc = ?',
        [id]
      );
      
      if (Array.isArray(rows) && rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(200).json({ ...req.body, MaThuoc: id });
      }
    } else {
      res.status(404).json({ message: 'Không tìm thấy thuốc để cập nhật' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thuốc:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thuốc' });
  }
};

// Xóa thuốc
export const deleteMedicine = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const [result] = await executeQuery(
      'DELETE FROM Thuoc WHERE MaThuoc = ?',
      [id]
    );
    
    if (isMySQLResult(result) && result.affectedRows && result.affectedRows > 0) {
      res.status(200).json({ message: 'Xóa thuốc thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy thuốc để xóa' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa thuốc:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thuốc' });
  }
}; 