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

import { ICompany } from '../types/companyTypes';
import { useDeleteCompany } from '../hook/useCompany';

type Order = 'asc' | 'desc';

interface Props {
  rows: ICompany[];
  search: string;
  isLoading?: boolean;
}

const headCells = [
  { id: 'name', label: 'Company Name', numeric: false },
  { id: 'country', label: 'Country', numeric: false }
];

function descendingComparator(a: any, b: any, orderBy: keyof ICompany) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order: Order, orderBy: keyof ICompany) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function CompanyTable({ rows, search, isLoading }: Props) {
  const navigate = useNavigate();
  const deleteCompany = useDeleteCompany();

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ICompany>('name');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading companies...</div>;
  }

  const filteredRows = rows.filter((row) => 
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.country.toLowerCase().includes(search.toLowerCase())
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
              <TableCell key={cell.id}>
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
              <TableCell>{row.country}</TableCell>

              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={() => navigate(`/inventory/companies/edit/${row.id}`)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => deleteCompany.mutate(row.id!)}>
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