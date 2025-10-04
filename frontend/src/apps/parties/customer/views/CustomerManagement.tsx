import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MainCard from 'components/MainCard';

import { useDispatch } from '@/store';
import { useSelector } from '@/store';
import { CustomerActions } from '../redux/CustomerSlice';
import { ICustomer } from '../redux/CustomerTypes';
import CreateCustomer from './CreateCustomer';

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.customer);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(CustomerActions.getAll());
  }, [dispatch]);

  const handleEdit = (customer: ICustomer) => {
    // dispatch(CustomerActions.setCustomer(customer));
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(CustomerActions.delete(id));
    }
  };

  const handleCreate = () => {
    // dispatch(CustomerActions.clear());
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {/* <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">Customers</Typography>
      </Breadcrumbs> */}

      <MainCard
        title="Customer Management"
        secondary={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Add Customer
          </Button>
        }
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.isActive ? 'Active' : 'Inactive'}
                      color={customer.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(customer)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(customer.id!)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Customer Form</DialogTitle>
        <DialogContent>
          <CreateCustomer onSuccess={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerManagement;
