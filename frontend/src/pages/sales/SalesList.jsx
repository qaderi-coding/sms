// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SALES LIST PAGE ||============================== //

export default function SalesList() {
  return (
    <MainCard title="Sales List">
      <Typography variant="body2">
        This is the Sales List page. Here you can view all sales transactions.
      </Typography>
    </MainCard>
  );
}