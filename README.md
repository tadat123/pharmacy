# Hệ Thống Quản Lý Hiệu Thuốc

Dự án quản lý hiệu thuốc toàn diện bao gồm:

## Cấu trúc dự án

- `client`: Giao diện người dùng (Frontend)
- `server`: API và xử lý nghiệp vụ (Backend)

## Cài đặt

### Yêu cầu
- Node.js
- npm hoặc yarn

### Hướng dẫn cài đặt

1. Clone repository
```bash
git clone https://github.com/tadat123/pharmacy.git
cd pharmacy
```

2. Cài đặt dependencies

```bash
# Cài đặt dependencies cho client
cd client
npm install

# Cài đặt dependencies cho server
cd ../server
npm install
```

3. Chạy ứng dụng

```bash
# Chạy server
cd server
npm run dev

# Chạy client (trong terminal khác)
cd client
npm start
```

## Tính năng

- Quản lý sản phẩm và kho hàng
- Quản lý đơn hàng và bán hàng
- Quản lý khách hàng
- Báo cáo và thống kê
- Quản lý nhân viên và phân quyền

## Công nghệ sử dụng

- Frontend: React.js
- Backend: Node.js, Express
- Database: SQL Server 