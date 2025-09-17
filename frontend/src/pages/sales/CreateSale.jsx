// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// ==============================|| CREATE SALE PAGE ||============================== //

export default function CreateSale() {
  return (
    <MainCard title="Create Sale">
      <Typography variant="body2">
        This is the Create Sale page. Here you can create new sales transactions.
      </Typography>
    </MainCard>
  );
}