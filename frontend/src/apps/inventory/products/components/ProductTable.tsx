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

import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';

import { IProduct } from '../types/productTypes';
import { useDeleteProduct } from '../hook/useProduct';

type Order = 'asc' | 'desc';

interface Props {
  rows: IProduct[];
  search: string;
  isLoading?: boolean;
}

const headCells = [
  { id: 'name', label: 'Product Name', numeric: false },
  { id: 'sku', label: 'SKU', numeric: false },
  { id: 'price', label: 'Price', numeric: true },
  { id: 'stockQuantity', label: 'Stock', numeric: true },
  { id: 'categoryName', label: 'Category', numeric: false },
  { id: 'companyName', label: 'Company', numeric: false }
];

function descendingComparator(a: any, b: any, orderBy: keyof IProduct) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: keyof IProduct) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function ProductTable({ rows, search, isLoading }: Props) {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof IProduct>('name');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading products...</div>;
  }

  const filteredRows = rows.filter((row) => 
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.sku.toLowerCase().includes(search.toLowerCase()) ||
    (row.categoryName && row.categoryName.toLowerCase().includes(search.toLowerCase())) ||
    (row.companyName && row.companyName.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedRows = [...filteredRows].sort(getComparator(order, orderBy));

  const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  };

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
          {visibleRows.map((row) => (
            <TableRow hover key={row.id}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>

              <TableCell>{row.name}</TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell align="right">${row.price.toFixed(2)}</TableCell>
              <TableCell align="right">
                <Chip 
                  label={row.stockQuantity} 
                  color={getStockColor(row.stockQuantity)}
                  size="small"
                />
              </TableCell>
              <TableCell>{row.categoryName}</TableCell>
              <TableCell>{row.companyName}</TableCell>

              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={() => navigate(`/inventory/products/edit/${row.id}`)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => deleteProduct.mutate(row.id!)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
}