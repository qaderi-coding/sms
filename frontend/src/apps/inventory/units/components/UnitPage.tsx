import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import MainCard from '@/ui-component/MainCard';
import UnitTable from './UnitTable';
import { useUnits } from '../hook/useUnit';

export default function UnitPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: units = [], isLoading } = useUnits();

  return (
    <MainCard
      title="Units"
      secondary={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inventory/units/create')}
        >
          Add Unit
        </Button>
      }
    >
      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>

      <UnitTable rows={units} search={search} isLoading={isLoading} />
    </MainCard>
  );
}