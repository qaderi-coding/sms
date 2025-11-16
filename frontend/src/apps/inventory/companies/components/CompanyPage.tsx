import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import MainCard from '@/ui-component/MainCard';
import CompanyTable from './CompanyTable';
import { useCompanies } from '../hook/useCompany';

export default function CompanyPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: companies = [], isLoading } = useCompanies();

  return (
    <MainCard
      title="Companies"
      secondary={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/inventory/companies/create')}
        >
          Add Company
        </Button>
      }
    >
      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>

      <CompanyTable rows={companies} search={search} isLoading={isLoading} />
    </MainCard>
  );
}