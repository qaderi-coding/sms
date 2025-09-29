import * as React from 'react';
import {
    Box,
    CardContent,
    Checkbox,
    Fab,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTable, TableState } from 'hooks/useTable';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { trans } from 'utils/functions/trans';
import { on } from 'node:events';

interface DataTableProps<T> {
    title: string;
    headCells: IHeadCell[];
    rows: T[];
    renderRow: (row: any, index: number) => React.ReactNode;
    onAdd?: () => void;
}

export const DataTable = <T,>({ title, headCells, rows, renderRow, onAdd }: DataTableProps<T>) => {
    const {
        order,
        orderBy,
        selected,
        page,
        rowsPerPage,
        search,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSearch
    } = useTable();
    const filteredRows = React.useMemo(() => {
        if (!search.trim()) return rows;

        const lowerSearch = search.toLowerCase();

        return rows.filter((row: any) =>
            Object.values(row).some((value) =>
                String(value ?? '')
                    .toLowerCase()
                    .includes(lowerSearch)
            )
        );
    }, [rows, search]);

    const sortedRows = React.useMemo(() => {
        const isSortable = (id: string) => headCells.find((h) => h.id === id)?.sortable === true;
        if (!orderBy || !isSortable(orderBy)) return filteredRows;
        return [...filteredRows].sort((a: any, b: any) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return order === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return order === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
        });
    }, [filteredRows, order, orderBy, headCells]);
    const handlePrint = () => {
        const printWindow = window.open('', '');
        if (!printWindow) return;

        const printableHeaders = headCells.filter((h) => !h.hideInPrint);
        const theadHtml = `
          <thead>
            <tr>
              ${printableHeaders.map((h) => `<th>${trans(h.label)}</th>`).join('')}
            </tr>
          </thead>
        `;

        const tbodyHtml = `
          <tbody>
            ${sortedRows
                .map((row) => {
                    const r = row as Record<string, any>;
                    return `
                  <tr>
                    ${printableHeaders.map((h) => `<td>${r[h.id] ?? ''}</td>`).join('')}
                  </tr>
                `;
                })
                .join('')}
          </tbody>
        `;

        const html = `
          <html>
            <head>
              <title>${title}</title>
              <style>
                @media print {
                  @page {
                    size: A4 portrait;
                    margin: 20mm;
                  }
                }
      
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                }
      
                h2 {
                  margin-bottom: 20px;
                }
      
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
      
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                }
      
                th {
                  background-color: #f2f2f2;
                  text-align: left;
                }
              </style>
            </head>
            <body>
              <h2>${title}</h2>
              <table>
                ${theadHtml}
                ${tbodyHtml}
              </table>
            </body>
          </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };
    const handleDownloadCSV = () => {
        const exportableHeaders = headCells.filter((h) => !h.hideInPrint);

        const headerRow = exportableHeaders.map((h) => `"${h.label}"`).join(',');

        const dataRows = sortedRows.map((row) => {
            const r = row as Record<string, any>;
            return exportableHeaders
                .map((h) => {
                    const cell = r[h.id] ?? '';
                    const escaped = String(cell).replace(/"/g, '""');
                    return `"${escaped}"`;
                })
                .join(',');
        });

        const csvContent = [headerRow, ...dataRows].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box>
            <CardContent>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleSearch}
                            placeholder={`Search ${title}`}
                            value={search}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                        <Tooltip title="Print">
                            <IconButton size="small" onClick={handlePrint}>
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download CSV">
                            <IconButton size="small" onClick={handleDownloadCSV}>
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip>
                        {onAdd && (
                            <Tooltip title="Add">
                                <Fab
                                    color="primary"
                                    size="small"
                                    onClick={onAdd}
                                    sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                                >
                                    <AddIcon fontSize="small" />
                                </Fab>
                            </Tooltip>
                        )}
                    </Grid>
                </Grid>
            </CardContent>

            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => {
                                const isSortable = headCell.sortable === true;
                                return (
                                    <TableCell
                                        key={headCell.id}
                                        sortDirection={isSortable && orderBy === headCell.id ? order : false}
                                        className={headCell.className}
                                    >
                                        {isSortable ? (
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={(e) => handleRequestSort(e, headCell.id)}
                                            >
                                                {trans(headCell.label)}
                                                {orderBy === headCell.id && (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                )}
                                            </TableSortLabel>
                                        ) : (
                                            trans(headCell.label)
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => renderRow(row, index))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={headCells.length + 2} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

