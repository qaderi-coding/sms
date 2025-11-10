import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, OutlinedInput, InputAdornment, IconButton, Paper, Tooltip, TableContainer } from '@mui/material';

import { Add as AddIcon, Search as SearchIcon, FileDownload as FileDownloadIcon, Print as PrintIcon } from '@mui/icons-material';

import MainCard from '@/ui-component/MainCard';

import CategoryTable from './CategoryTable';

// ✅ React Query
import { useCategories } from '../hook/useCategory';

export default function CategoryPage() {
  const navigate = useNavigate();

  // ✅ Fetch list here (best practice)
  const { data: categories, isLoading } = useCategories();

  const [search, setSearch] = React.useState('');

  return (
    <MainCard content={false}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* ----- TOOLBAR ----- */}
        <Box
          p={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          borderBottom="1px solid #e0e0e0"
        >
          {/* Search */}
          <OutlinedInput
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            sx={{ width: { xs: '100%', sm: 280 }, borderRadius: 2 }}
          />

          {/* Buttons */}
          <Box display="flex" gap={1}>
            <Tooltip title="Download Excel">
              <IconButton>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Print">
              <IconButton onClick={() => window.print()}>
                <PrintIcon />
              </IconButton>
            </Tooltip>

            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/category/add')} sx={{ borderRadius: 2 }}>
              Create
            </Button>
          </Box>
        </Box>

        {/* ----- TABLE COMPONENT ----- */}
        <CategoryTable rows={categories || []} search={search} isLoading={isLoading} />
      </TableContainer>
    </MainCard>
  );
}
