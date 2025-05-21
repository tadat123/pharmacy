// Định nghĩa các interface cho các bảng trong cơ sở dữ liệu

export interface NhanVien {
  MaNhanVien: number;
  TaiKhoan: string;
  MatKhau: string;
  HoTen: string;
  SoDienThoai: string;
  Email: string;
  ChucVu: string;
}

export interface NhanVienQuanLy {
  MaNhanVien: number;
  TongTien: string;
}

export interface KhachHang {
  MaKhachHang: number;
  HoTen: string;
  SoDienThoai: string;
  DiaChi: string;
  DiemTichLuy: string;
}

export interface Thuoc {
  MaThuoc: number;
  TenThuoc: string;
  DonVi: string;
  HangSanXuat: string;
  NhomThuoc: string;
  GiaNhap: number;
  GiaBan: number;
  MoTa: string;
}

export interface HoaDon {
  MaHoaDon: number;
  MaNhanVien: number;
  MaKhachHang: number | null;
  NgayLap: Date;
  TongTien: number;
}

export interface ChiTietHoaDon {
  MaChiTiet: number;
  MaHoaDon: number;
  MaThuoc: number;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
}

export interface PhieuNhapKho {
  MaPhieuNhap: number;
  NgayNhap: string;
  TongTienNhap: string;
  MaNhanVien: number;
}

export interface ChiTietPhieuNhap {
  MaChiTiet: number;
  MaPhieuNhap: number;
  MaThuoc: number;
  SoLuong: number;
  Gia: number;
  HanSuDung: string;
  TongTien: number;
}

export interface PhieuXuatKho {
  MaPhieuXuat: number;
  NgayXuat: string;
  LyDo: string;
  NguoiNhan: string;
  MaNhanVien: number;
}

export interface ChiTietPhieuXuat {
  MaChiTiet: number;
  MaPhieuXuat: number;
  MaThuoc: number;
  SoLuong: number;
}

export interface NhaCungCap {
  MaNCC: number;
  TenNCC: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
  NguoiLienHe: string;
}

export interface Thuoc_NhaCungCap {
  MaThuoc: number;
  MaNCC: number;
}

export interface KhuyenMai {
  MaKM: number;
  MaCode: string;
  NgayBatDau: string;
  NgayKetThuc: string;
  SoLuong: string;
}

export interface KhuyenMaiChoKhachHang {
  MaKhachHang: number;
  MaKM: number;
  DieuKien: string;
} 