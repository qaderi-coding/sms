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
  Tooltip
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';

import { IProductUnitConversion } from '../types/productUnitConversionTypes';
import { useDeleteProductUnitConversion } from '../hook/useProductUnitConversion';

type Order = 'asc' | 'desc';

interface Props {
  rows: IProductUnitConversion[];
  search: string;
  isLoading?: boolean;
}

const headCells = [
  { id: 'productName', label: 'Product', numeric: false },
  { id: 'unitName', label: 'Unit', numeric: false },
  { id: 'factor', label: 'Conversion Factor', numeric: true }
];

function descendingComparator(a: any, b: any, orderBy: keyof IProductUnitConversion) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: keyof IProductUnitConversion) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function ProductUnitConversionTable({ rows, search, isLoading }: Props) {
  const navigate = useNavigate();
  const deleteConversion = useDeleteProductUnitConversion();

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof IProductUnitConversion>('productName');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading unit conversions...</div>;
  }

  const filteredRows = rows.filter((row) => 
    (row.productName && row.productName.toLowerCase().includes(search.toLowerCase())) ||
    (row.unitName && row.unitName.toLowerCase().includes(search.toLowerCase()))
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
          {visibleRows.map((row) => (
            <TableRow hover key={row.id}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>

              <TableCell>{row.productName}</TableCell>
              <TableCell>{row.unitName}</TableCell>
              <TableCell align="right">{row.factor}</TableCell>

              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={() => navigate(`/inventory/product-unit-conversions/edit/${row.id}`)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => deleteConversion.mutate(row.id!)}>
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