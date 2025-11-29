import MainCard from '@/ui-component/MainCard';
import { Button, Box, Typography, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { ISale } from '../types/saleTypes';
import { useSale, useReturnSale } from '../hook/useSale';
import SaleItemsFieldArray from './SaleItemsFieldArray';
import SaleBillSummary from './SaleBillSummary';

export default function SaleReturnForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: originalSale, isLoading } = useSale(Number(id));
  const returnSale = useReturnSale();

  const handleSubmit = async (values: ISale) => {
    try {
      // Mark as return by making amounts negative
      const returnData = {
        ...values,
        totalAmount: -Math.abs(values.totalAmount),
        items: values.items.map(item => ({
          ...item,
          quantity: -Math.abs(item.quantity),
          totalPrice: -Math.abs(item.totalPrice)
        }))
      };
      
      await returnSale.mutateAsync(returnData);
      navigate('/sales');
    } catch (error) {
      console.error('Error processing return:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!originalSale) return <div>Sale not found</div>;

  const initialValues: ISale = {
    ...originalSale,
    id: undefined, // New return record
    saleDate: new Date().toISOString().split('T')[0],
    notes: `Return for Sale #${originalSale.id}`
  };

  return (
    <MainCard title={`Process Return - Sale #${originalSale.id}`}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          You are processing a return for Sale #{originalSale.id}. 
          Adjust quantities and items as needed for the return.
        </Typography>
      </Alert>

      <Formik 
        initialValues={initialValues} 
        onSubmit={handleSubmit} 
        enableReinitialize
      >
        {({ values, isSubmitting }) => (
          <Form>
            <SaleItemsFieldArray />
            <SaleBillSummary />

            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/sales')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                color="warning"
                disabled={isSubmitting || values.items.length === 0}
              >
                Process Return
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
}