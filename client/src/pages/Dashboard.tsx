import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader,
  Avatar,
  Stack,
} from '@mui/material';
import { 
  LocalPharmacy, 
  People, 
  ReceiptLong, 
  Healing, 
  LocalShipping, 
  Inventory 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: 'Quản lý thuốc',
      icon: <LocalPharmacy fontSize="large" color="primary" />,
      description: 'Quản lý danh sách thuốc, thêm, sửa, xóa thuốc.',
      link: '/medicines',
      color: '#3f51b5',
    },
    {
      title: 'Hóa đơn',
      icon: <ReceiptLong fontSize="large" color="secondary" />,
      description: 'Tạo hóa đơn mới, xem danh sách hóa đơn.',
      link: '/invoices',
      color: '#f50057',
    },
    {
      title: 'Khách hàng',
      icon: <People fontSize="large" color="success" />,
      description: 'Quản lý thông tin khách hàng, lịch sử mua hàng.',
      link: '/customers',
      color: '#4caf50',
    },
    {
      title: 'Nhân viên',
      icon: <Healing fontSize="large" color="error" />,
      description: 'Quản lý thông tin nhân viên, phân quyền.',
      link: '/staff',
      color: '#f44336',
    },
    {
      title: 'Nhà cung cấp',
      icon: <LocalShipping fontSize="large" style={{ color: '#ff9800' }} />,
      description: 'Quản lý danh sách nhà cung cấp, thông tin liên hệ.',
      link: '/suppliers',
      color: '#ff9800',
    },
    {
      title: 'Kho thuốc',
      icon: <Inventory fontSize="large" style={{ color: '#795548' }} />,
      description: 'Quản lý kho, nhập xuất thuốc, kiểm kê.',
      link: '/warehouse',
      color: '#795548',
    },
  ];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Chào mừng, {user?.HoTen}!
        </Typography>
        <Typography variant="body1">
          Đây là hệ thống quản lý nhà thuốc. Vui lòng chọn chức năng bên dưới để tiếp tục.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
        {dashboardItems.map((item, index) => (
          <Box key={index} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
                cursor: 'pointer',
              }}
              onClick={() => window.location.href = item.link}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: item.color }}>
                    {item.icon}
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="div">
                    {item.title}
                  </Typography>
                }
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard; 