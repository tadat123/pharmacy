import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { staffAPI } from '../services/api';

interface User {
  MaNhanVien: number;
  TaiKhoan: string;
  HoTen: string;
  ChucVu: string;
  SoDienThoai: string;
  Email: string;
}

interface AuthContextType {
  user: User;
  loading: boolean;
  error: string | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const defaultUser: User = {
  MaNhanVien: 1,
  TaiKhoan: 'admin',
  HoTen: 'Quản Trị Viên',
  ChucVu: 'Admin',
  SoDienThoai: '0123456789',
  Email: 'admin@pharmacy.com'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Không cần kiểm tra localStorage nữa vì luôn đã đăng nhập
    setLoading(false);
  }, []);

  const logout = () => {
    // Không thực sự đăng xuất, chỉ để giữ API tương thích
    console.log('Logout gọi nhưng không có tác dụng vì đã bỏ chức năng đăng nhập');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 