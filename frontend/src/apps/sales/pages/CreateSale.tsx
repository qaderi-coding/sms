import { useNavigate } from 'react-router-dom';

// material-ui
import { Typography, Breadcrumbs, Link } from '@mui/material';

// project imports
import SaleForm from '../components/SaleForm';

// ==============================|| CREATE SALE PAGE ||============================== //

export default function CreateSale() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/sales/list');
  };

  return (
    <>
      <SaleForm onSuccess={handleSuccess} />
    </>
  );
}
