// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// ==============================|| DAILY SALES REPORT PAGE ||============================== //

export default function DailySales() {
  return (
    <MainCard title="Daily Sales Report">
      <Typography variant="body2">
        This is the Daily Sales Report page. Here you can view daily sales analytics and reports.
      </Typography>
    </MainCard>
  );
}