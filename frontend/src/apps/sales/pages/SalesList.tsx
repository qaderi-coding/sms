import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Print as PrintIcon } from '@mui/icons-material';

// project imports
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'store';
import { fetchSales, setCurrentSale } from '../store/salesSlice';
import { Sale } from '../types';

// ==============================|| SALES LIST PAGE ||============================== //

export default function SalesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sales, loading } = useSelector((state) => state.sales);

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const handleEdit = (sale: Sale) => {
    dispatch(setCurrentSale(sale));
    navigate(`/sales/edit/${sale.id}`);
  };

  const handlePrint = (sale: Sale) => {
    navigate(`/sales/print/${sale.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PARTIAL':
        return 'warning';
      case 'PENDING':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">Sales</Typography>
      </Breadcrumbs>

      <MainCard
        title="Sales List"
        secondary={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/sales/create')}
          >
            Create Sale
          </Button>
        }
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Final Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>
                  <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                  <TableCell>${sale.total_amount?.toFixed(2)}</TableCell>
                  <TableCell>${sale.final_amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={sale.payment_status}
                      color={getStatusColor(sale.payment_status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(sale)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handlePrint(sale)}
                      >
                        <PrintIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </>
  );
}