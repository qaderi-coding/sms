import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import MainCard from '@/ui-component/MainCard';
import BikeModelTable from './BikeModelTable';
import { useBikeModels } from '../hook/useBikeModel';

export default function BikeModelPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: bikeModels = [], isLoading } = useBikeModels();

  return (
    <MainCard
      title="Bike Models"
      secondary={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inventory/bike-models/create')}
        >
          Add Bike Model
        </Button>
      }
    >
      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Search bike models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>

      <BikeModelTable rows={bikeModels} search={search} isLoading={isLoading} />
    </MainCard>
  );
}