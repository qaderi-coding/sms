import React from 'react';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TablePagination,
  TableSortLabel,
  Box,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import UndoIcon from '@mui/icons-material/Undo';

import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';

import { ISale } from '../types/saleTypes';
import { useDeleteSale } from '../hook/useSale';

type Order = 'asc' | 'desc';

interface Props {
  rows: ISale[];
  search: string;
  isLoading?: boolean;
}

const headCells = [
  { id: 'id', label: 'Sale #', numeric: true },
  { id: 'customerName', label: 'Customer', numeric: false },
  { id: 'saleDate', label: 'Date', numeric: false },
  { id: 'totalAmount', label: 'Amount', numeric: true },
  { id: 'paymentStatus', label: 'Status', numeric: false },
  { id: 'currency', label: 'Currency', numeric: false }
];

const getPaymentStatusLabel = (status: number) => {
  const statusMap = {
    0: { label: 'Pending', color: 'warning' as const },
    1: { label: 'Paid', color: 'success' as const },
    2: { label: 'Partial', color: 'info' as const },
    3: { label: 'Overdue', color: 'error' as const }
  };
  return statusMap[status] || { label: 'Unknown', color: 'default' as const };
};

function descendingComparator(a: any, b: any, orderBy: keyof ISale) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: keyof ISale) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function SaleTable({ rows, search, isLoading }: Props) {
  const navigate = useNavigate();
  const deleteSale = useDeleteSale();

  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof ISale>('id');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading sales...</div>;
  }

  const filteredRows = rows.filter((row) => 
    (row.customerName && row.customerName.toLowerCase().includes(search.toLowerCase())) ||
    row.id?.toString().includes(search) ||
    row.currency.toLowerCase().includes(search.toLowerCase())
  );

  const sortedRows = [...filteredRows].sort(getComparator(order, orderBy));

  const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />

            {headCells.map((cell) => (
              <TableCell key={cell.id} align={cell.numeric ? 'right' : 'left'}>
                <TableSortLabel
                  active={orderBy === cell.id}
                  direction={orderBy === cell.id ? order : 'asc'}
                  onClick={() => setOrder(orderBy === cell.id && order === 'asc' ? 'desc' : 'asc')}
                >
                  {cell.label}
                  {orderBy === cell.id && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'asc' ? 'sorted ascending' : 'sorted descending'}
                    </Box>
                  )}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleRows.map((row) => {
            const paymentStatus = getPaymentStatusLabel(row.paymentStatus);
            
            return (
              <TableRow hover key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>

                <TableCell align="right">#{row.id}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{new Date(row.saleDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  {row.currency} {row.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={paymentStatus.label} 
                    color={paymentStatus.color}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.currency}</TableCell>

                <TableCell align="right">
                  <Tooltip title="Print">
                    <IconButton onClick={() => navigate(`/sales/print/${row.id}`)} size="small">
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton onClick={() => navigate(`/sales/edit/${row.id}`)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Return">
                    <IconButton onClick={() => navigate(`/sales/return/${row.id}`)} size="small" color="warning">
                      <UndoIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => deleteSale.mutate(row.id!)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TablePagination
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
}