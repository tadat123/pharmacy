import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API cho thuốc
export const medicineAPI = {
  getAllMedicines: () => api.get('/medicines'),
  getMedicineById: (id: number) => api.get(`/medicines/${id}`),
  createMedicine: (data: any) => api.post('/medicines', data),
  updateMedicine: (id: number, data: any) => api.put(`/medicines/${id}`, data),
  deleteMedicine: (id: number) => api.delete(`/medicines/${id}`),
};

// API cho hóa đơn
export const invoiceAPI = {
  getAllInvoices: () => api.get('/invoices'),
  getInvoiceById: (id: number) => api.get(`/invoices/${id}`),
  createInvoice: (data: any) => api.post('/invoices', data),
  updateInvoice: (id: number, data: any) => api.put(`/invoices/${id}`, data),
  deleteInvoice: (id: number) => api.delete(`/invoices/${id}`),
};

// API cho khách hàng
export const customerAPI = {
  getAllCustomers: () => api.get('/customers'),
  getCustomerById: (id: number) => api.get(`/customers/${id}`),
  searchCustomerByPhone: (phone: string) => api.get(`/customers/search/phone/${phone}`),
  createCustomer: (data: any) => api.post('/customers', data),
  updateCustomer: (id: number, data: any) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id: number) => api.delete(`/customers/${id}`),
};

// API cho nhân viên
export const staffAPI = {
  login: (credentials: { TaiKhoan: string; MatKhau: string }) => api.post('/staff/login', credentials),
  getAllStaff: () => api.get('/staff'),
  getStaffById: (id: number) => api.get(`/staff/${id}`),
  createStaff: (data: any) => api.post('/staff', data),
  updateStaff: (id: number, data: any) => api.put(`/staff/${id}`, data),
  deleteStaff: (id: number) => api.delete(`/staff/${id}`),
};

export default api; 