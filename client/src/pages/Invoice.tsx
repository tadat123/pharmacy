import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AlertColor,
  Snackbar,
  Alert,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { invoiceAPI, customerAPI, staffAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Invoice {
  MaHoaDon: number;
  MaNhanVien: number;
  MaKhachHang: number | null;
  NgayLap: Date | string;
  TongTien: number;
  GiamGia: number;
  ThanhToan: number;
  TenKhachHang?: string;
  TenNhanVien?: string;
}

interface Customer {
  MaKhachHang: number;
  HoTen: string;
  SoDienThoai: string;
  DiaChi: string;
}

interface Staff {
  MaNhanVien: number;
  HoTen: string;
}

const emptyInvoice: Invoice = {
  MaHoaDon: 0,
  MaNhanVien: 0,
  MaKhachHang: null,
  NgayLap: new Date(),
  TongTien: 0,
  GiamGia: 0,
  ThanhToan: 0,
};

const InvoicePage: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(emptyInvoice);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchStaffs();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await invoiceAPI.getAllInvoices();
      // Đảm bảo mỗi hóa đơn có đầy đủ các trường
      const sanitizedInvoices = response.data.map((invoice: any) => ({
        MaHoaDon: invoice.MaHoaDon || 0,
        MaNhanVien: invoice.MaNhanVien || 0,
        MaKhachHang: invoice.MaKhachHang || null,
        NgayLap: invoice.NgayLap ? new Date(invoice.NgayLap) : new Date(),
        TongTien: invoice.TongTien || 0,
        GiamGia: invoice.GiamGia || 0,
        ThanhToan: invoice.ThanhToan || 0,
        TenKhachHang: invoice.TenKhachHang || 'Khách lẻ',
        TenNhanVien: invoice.TenNhanVien || '',
      }));
      setInvoices(sanitizedInvoices);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      showAlert('Không thể tải danh sách hóa đơn', 'error');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAllCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
    }
  };

  const fetchStaffs = async () => {
    try {
      const response = await staffAPI.getAllStaff();
      setStaffs(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      setCurrentInvoice(invoice);
      setIsEditing(true);
    } else {
      setCurrentInvoice({
        ...emptyInvoice,
        MaNhanVien: user?.MaNhanVien || 0,
        NgayLap: new Date(),
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentInvoice({
      ...currentInvoice,
      [name]: ['TongTien', 'GiamGia', 'ThanhToan'].includes(name) ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setCurrentInvoice({
      ...currentInvoice,
      [name]: value === '' ? null : value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentInvoice({
        ...currentInvoice,
        NgayLap: date,
      });
    }
  };

  const handleSaveInvoice = async () => {
    try {
      if (isEditing) {
        // Cập nhật hóa đơn hiện có
        await invoiceAPI.updateInvoice(currentInvoice.MaHoaDon, currentInvoice);
        showAlert('Cập nhật hóa đơn thành công', 'success');
      } else {
        // Tạo hóa đơn mới
        await invoiceAPI.createInvoice(currentInvoice);
        showAlert('Thêm hóa đơn mới thành công', 'success');
      }
      handleCloseDialog();
      fetchInvoices();
    } catch (error) {
      console.error('Lỗi khi lưu hóa đơn:', error);
      showAlert('Không thể lưu thông tin hóa đơn', 'error');
    }
  };

  const handleConfirmDelete = (invoice: Invoice) => {
    setConfirmDelete({ open: true, invoice });
  };

  const handleDeleteInvoice = async () => {
    if (!confirmDelete.invoice) return;
    
    try {
      await invoiceAPI.deleteInvoice(confirmDelete.invoice.MaHoaDon);
      showAlert('Xóa hóa đơn thành công', 'success');
      fetchInvoices();
      setConfirmDelete({ open: false, invoice: null });
    } catch (error) {
      console.error('Lỗi khi xóa hóa đơn:', error);
      showAlert('Không thể xóa hóa đơn', 'error');
    }
  };

  const showAlert = (message: string, severity: AlertColor) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleExportToExcel = () => {
    // Triển khai tính năng xuất file Excel ở đây
    showAlert('Chức năng xuất file Excel đang được phát triển', 'info');
  };

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredInvoices = invoices.filter(invoice => {
    // Lọc theo mã hóa đơn
    const matchesFilter = filter ? invoice.MaHoaDon.toString().includes(filter) : true;
    
    // Lọc theo ngày bắt đầu
    const matchesStartDate = startDate ? new Date(invoice.NgayLap) >= startDate : true;
    
    // Lọc theo ngày kết thúc
    const matchesEndDate = endDate ? new Date(invoice.NgayLap) <= endDate : true;
    
    return matchesFilter && matchesStartDate && matchesEndDate;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Quản lý hóa đơn</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Thêm hóa đơn
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportToExcel}
          >
            Xuất file
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            label="Theo mã hóa đơn"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Ngày bắt đầu"
            type="date"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Ngày kết thúc"
            type="date"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã hóa đơn</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Tổng tiền hàng</TableCell>
                <TableCell>Giảm giá</TableCell>
                <TableCell>Khách đã trả</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                  <TableRow key={invoice.MaHoaDon}>
                    <TableCell>HD{invoice.MaHoaDon.toString().padStart(5, '0')}</TableCell>
                    <TableCell>{formatDate(invoice.NgayLap)}</TableCell>
                    <TableCell>{invoice.TenKhachHang || 'Khách lẻ'}</TableCell>
                    <TableCell>{formatCurrency(invoice.TongTien)}</TableCell>
                    <TableCell>{formatCurrency(invoice.GiamGia)}</TableCell>
                    <TableCell>{formatCurrency(invoice.ThanhToan)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(invoice)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleConfirmDelete(invoice)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Dialog thêm/sửa hóa đơn */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Cập nhật thông tin hóa đơn' : 'Thêm hóa đơn mới'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {isEditing && (
              <TextField
                margin="dense"
                label="Mã hóa đơn"
                value={`HD${currentInvoice.MaHoaDon.toString().padStart(5, '0')}`}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            )}
            
            <FormControl 
              fullWidth 
              margin="dense" 
              sx={{ gridColumn: isEditing ? "2 / 3" : "1 / 3" }}
            >
              <InputLabel id="customer-label">Khách hàng</InputLabel>
              <Select
                labelId="customer-label"
                name="MaKhachHang"
                value={currentInvoice.MaKhachHang || ''}
                label="Khách hàng"
                onChange={handleSelectChange as any}
              >
                <MenuItem value="">Khách lẻ</MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.MaKhachHang} value={customer.MaKhachHang}>
                    {customer.HoTen} - {customer.SoDienThoai}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Ngày lập"
              type="date"
              fullWidth
              value={currentInvoice.NgayLap instanceof Date 
                ? currentInvoice.NgayLap.toISOString().split('T')[0]
                : new Date(currentInvoice.NgayLap).toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null)}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="staff-label">Nhân viên</InputLabel>
              <Select
                labelId="staff-label"
                name="MaNhanVien"
                value={currentInvoice.MaNhanVien}
                label="Nhân viên"
                onChange={handleSelectChange as any}
                required
              >
                {staffs.map((staff) => (
                  <MenuItem key={staff.MaNhanVien} value={staff.MaNhanVien}>
                    {staff.HoTen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="TongTien"
              label="Tổng tiền hàng"
              type="number"
              fullWidth
              value={currentInvoice.TongTien || 0}
              onChange={handleInputChange}
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />

            <TextField
              margin="dense"
              name="GiamGia"
              label="Giảm giá"
              type="number"
              fullWidth
              value={currentInvoice.GiamGia || 0}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />

            <TextField
              margin="dense"
              name="ThanhToan"
              label="Khách đã trả"
              type="number"
              fullWidth
              value={currentInvoice.ThanhToan || 0}
              onChange={handleInputChange}
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />

            <TextField
              margin="dense"
              label="Còn lại"
              type="number"
              fullWidth
              value={(currentInvoice.TongTien || 0) - (currentInvoice.GiamGia || 0) - (currentInvoice.ThanhToan || 0)}
              InputProps={{
                readOnly: true,
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveInvoice} variant="contained" color="primary">
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, invoice: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa hóa đơn HD{confirmDelete.invoice?.MaHoaDon.toString().padStart(5, '0')} không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, invoice: null })}>Hủy</Button>
          <Button onClick={handleDeleteInvoice} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoicePage; 