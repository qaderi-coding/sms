import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import MainCard from '@/ui-component/MainCard';
import ProductUnitConversionTable from './ProductUnitConversionTable';
import { useProductUnitConversions } from '../hook/useProductUnitConversion';

export default function ProductUnitConversionPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: conversions = [], isLoading } = useProductUnitConversions();

  return (
    <MainCard
      title="Product Unit Conversions"
      secondary={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inventory/product-unit-conversions/create')}
        >
          Add Conversion
        </Button>
      }
    >
      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Search conversions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>

      <ProductUnitConversionTable rows={conversions} search={search} isLoading={isLoading} />
    </MainCard>
  );
}