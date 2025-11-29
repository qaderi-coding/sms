import React, { useState } from 'react';
import { Button, TextField, Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { 
  Add as AddIcon, 
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import MainCard from '@/ui-component/MainCard';
import SaleTable from './SaleTable';
import { useSales } from '../hook/useSale';

export default function SalePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: sales = [], isLoading } = useSales();

  // Calculate statistics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const paidSales = sales.filter(sale => sale.paymentStatus === 1).length;
  const pendingSales = sales.filter(sale => sale.paymentStatus === 0).length;

  return (
    <>
      {/* Statistics Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ReceiptIcon color="primary" />
                <Box>
                  <Typography variant="h4">{totalSales}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Sales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MoneyIcon color="success" />
                <Box>
                  <Typography variant="h4">${totalRevenue.toFixed(0)}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUpIcon color="info" />
                <Box>
                  <Typography variant="h4">{paidSales}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Paid Sales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ReceiptIcon color="warning" />
                <Box>
                  <Typography variant="h4">{pendingSales}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending Sales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Sales Table */}
      <MainCard
        title="Sales Management"
        secondary={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/sales/create')}
          >
            New Sale
          </Button>
        }
      >
        <Box mb={2}>
          <TextField
            fullWidth
            placeholder="Search sales by customer, ID, or currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>

        <SaleTable rows={sales} search={search} isLoading={isLoading} />
      </MainCard>
    </>
  );
}