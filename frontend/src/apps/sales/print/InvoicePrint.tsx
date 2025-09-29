import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';

// project imports
import { useDispatch, useSelector } from 'store';
import { fetchSales } from '../store/salesSlice';
import { Sale } from '../types';

// ==============================|| INVOICE PRINT ||============================== //

export default function InvoicePrint() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state.sales);
  const printRef = useRef<HTMLDivElement>(null);

  const sale = sales.find(s => s.id === Number(id));

  useEffect(() => {
    if (!sale) {
      dispatch(fetchSales());
    }
  }, [dispatch, sale]);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  if (!sale) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Invoice</Typography>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print Invoice
        </Button>
      </Box>

      <div ref={printRef}>
        <Paper sx={{ p: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" mb={4}>
            <Box>
              <Typography variant="h4" color="primary" gutterBottom>
                SHOP MANAGEMENT SYSTEM
              </Typography>
              <Typography variant="body2">
                123 Business Street<br />
                City, State 12345<br />
                Phone: (555) 123-4567
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5" gutterBottom>
                INVOICE
              </Typography>
              <Typography variant="body2">
                Invoice #: {sale.id}<br />
                Date: {new Date(sale.sale_date).toLocaleDateString()}<br />
                Status: {sale.payment_status}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Customer Info */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Bill To:
            </Typography>
            <Typography variant="body1">
              {sale.customer_name}
            </Typography>
          </Box>

          {/* Items Table */}
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Item</strong></TableCell>
                  <TableCell align="center"><strong>Quantity</strong></TableCell>
                  <TableCell align="right"><strong>Unit Price</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell align="right">${item.total_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box display="flex" justifyContent="flex-end">
            <Box minWidth={300}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">${sale.total_amount.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Discount:</Typography>
                <Typography variant="body1">-${sale.discount.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${sale.final_amount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Notes */}
          {sale.notes && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Notes:
              </Typography>
              <Typography variant="body2">
                {sale.notes}
              </Typography>
            </Box>
          )}

          {/* Footer */}
          <Box mt={6} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Thank you for your business!
            </Typography>
          </Box>
        </Paper>
      </div>
    </Box>
  );
}