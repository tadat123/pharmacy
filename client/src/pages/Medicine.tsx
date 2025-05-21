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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { medicineAPI } from '../services/api';

interface Medicine {
  MaThuoc: number;
  TenThuoc: string;
  DonVi: string;
  HangSanXuat: string;
  NhomThuoc: string;
  GiaNhap: number;
  GiaBan: number;
  MoTa: string;
}

const emptyMedicine: Medicine = {
  MaThuoc: 0,
  TenThuoc: '',
  DonVi: '',
  HangSanXuat: '',
  NhomThuoc: '',
  GiaNhap: 0,
  GiaBan: 0,
  MoTa: '',
};

const MedicinePage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<Medicine>(emptyMedicine);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; medicine: Medicine | null }>({
    open: false,
    medicine: null,
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getAllMedicines();
      // Đảm bảo mỗi thuốc có đầy đủ các trường
      const sanitizedMedicines = response.data.map((medicine: any) => ({
        MaThuoc: medicine.MaThuoc || 0,
        TenThuoc: medicine.TenThuoc || '',
        DonVi: medicine.DonVi || '',
        HangSanXuat: medicine.HangSanXuat || '',
        NhomThuoc: medicine.NhomThuoc || '',
        GiaNhap: medicine.GiaNhap || 0,
        GiaBan: medicine.GiaBan || 0,
        MoTa: medicine.MoTa || '',
      }));
      setMedicines(sanitizedMedicines);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thuốc:', error);
      showAlert('Không thể tải danh sách thuốc', 'error');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (medicine?: Medicine) => {
    if (medicine) {
      setCurrentMedicine(medicine);
      setIsEditing(true);
    } else {
      setCurrentMedicine(emptyMedicine);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentMedicine({
      ...currentMedicine,
      [name]: name === 'GiaNhap' || name === 'GiaBan' ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    setCurrentMedicine({
      ...currentMedicine,
      [name]: e.target.value,
    });
  };

  const handleSaveMedicine = async () => {
    try {
      if (isEditing) {
        await medicineAPI.updateMedicine(currentMedicine.MaThuoc, currentMedicine);
        showAlert('Cập nhật thuốc thành công', 'success');
      } else {
        await medicineAPI.createMedicine(currentMedicine);
        showAlert('Thêm thuốc mới thành công', 'success');
      }
      handleCloseDialog();
      fetchMedicines();
    } catch (error) {
      console.error('Lỗi khi lưu thuốc:', error);
      showAlert('Không thể lưu thông tin thuốc', 'error');
    }
  };

  const handleConfirmDelete = (medicine: Medicine) => {
    setConfirmDelete({ open: true, medicine });
  };

  const handleDeleteMedicine = async () => {
    if (!confirmDelete.medicine) return;
    
    try {
      await medicineAPI.deleteMedicine(confirmDelete.medicine.MaThuoc);
      showAlert('Xóa thuốc thành công', 'success');
      fetchMedicines();
      setConfirmDelete({ open: false, medicine: null });
    } catch (error) {
      console.error('Lỗi khi xóa thuốc:', error);
      showAlert('Không thể xóa thuốc', 'error');
    }
  };

  const showAlert = (message: string, severity: AlertColor) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Quản lý thuốc</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm thuốc mới
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã thuốc</TableCell>
                <TableCell>Tên thuốc</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Hãng sản xuất</TableCell>
                <TableCell>Nhóm thuốc</TableCell>
                <TableCell>Giá nhập</TableCell>
                <TableCell>Giá bán</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((medicine) => (
                  <TableRow key={medicine.MaThuoc}>
                    <TableCell>{medicine.MaThuoc}</TableCell>
                    <TableCell>{medicine.TenThuoc}</TableCell>
                    <TableCell>{medicine.DonVi}</TableCell>
                    <TableCell>{medicine.HangSanXuat}</TableCell>
                    <TableCell>{medicine.NhomThuoc}</TableCell>
                    <TableCell>{medicine.GiaNhap ? medicine.GiaNhap.toLocaleString() : '0'} VNĐ</TableCell>
                    <TableCell>{medicine.GiaBan ? medicine.GiaBan.toLocaleString() : '0'} VNĐ</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(medicine)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleConfirmDelete(medicine)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {medicines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
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
          count={medicines.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Dialog thêm/sửa thuốc */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Cập nhật thông tin thuốc' : 'Thêm thuốc mới'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
              autoFocus
              margin="dense"
              name="TenThuoc"
              label="Tên thuốc"
              type="text"
              fullWidth
              value={currentMedicine.TenThuoc}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="DonVi"
              label="Đơn vị"
              type="text"
              fullWidth
              value={currentMedicine.DonVi}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="HangSanXuat"
              label="Hãng sản xuất"
              type="text"
              fullWidth
              value={currentMedicine.HangSanXuat}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="nhom-thuoc-label">Nhóm thuốc</InputLabel>
              <Select
                labelId="nhom-thuoc-label"
                name="NhomThuoc"
                value={currentMedicine.NhomThuoc}
                label="Nhóm thuốc"
                onChange={handleSelectChange as any}
                required
              >
                <MenuItem value="Kháng sinh">Kháng sinh</MenuItem>
                <MenuItem value="Giảm đau">Giảm đau</MenuItem>
                <MenuItem value="Hạ sốt">Hạ sốt</MenuItem>
                <MenuItem value="Tiêu hóa">Tiêu hóa</MenuItem>
                <MenuItem value="Vitamin">Vitamin</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="GiaNhap"
              label="Giá nhập"
              type="number"
              fullWidth
              value={currentMedicine.GiaNhap || 0}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="GiaBan"
              label="Giá bán"
              type="number"
              fullWidth
              value={currentMedicine.GiaBan || 0}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="MoTa"
              label="Mô tả"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={currentMedicine.MoTa}
              onChange={handleInputChange}
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveMedicine} variant="contained" color="primary">
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, medicine: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thuốc "{confirmDelete.medicine?.TenThuoc}" không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, medicine: null })}>Hủy</Button>
          <Button onClick={handleDeleteMedicine} variant="contained" color="error">
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

export default MedicinePage; 