import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import MainCard from '@/ui-component/MainCard';
import ProductTable from './ProductTable';
import { useProducts } from '../hook/useProduct';

export default function ProductPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: products = [], isLoading } = useProducts();

  return (
    <MainCard
      title="Products"
      secondary={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inventory/products/create')}
        >
          Add Product
        </Button>
      }
    >
      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>

      <ProductTable rows={products} search={search} isLoading={isLoading} />
    </MainCard>
  );
}