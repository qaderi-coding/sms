import MainCard from '@/ui-component/MainCard';
import FormikTextField from '@/ui-custom/formik/FormikTextField';
import FormikSelectField from '@/ui-custom/formik/FormikSelectField';
import FormikDatePicker from '@/ui-custom/formik/FormikDatePicker';
import WrapInGrid from '@/ui-custom/WrapInGrid';
import PropsGenerator from '@/utils/types/PropsGenerator';

import { Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { ISale } from '../types/saleTypes';
import { useSale, useCreateSale, useUpdateSale } from '../hook/useSale';
import SaleItemsFieldArray from './SaleItemsFieldArray';
import SaleBillSummary from './SaleBillSummary';

import FormikAutoCompleteField from '@/ui-custom/formik/FormikAutoCompleteField';
import { AutoCompleteOptionsSelector } from '@/ui-custom/props/AutoCompleteFieldProps';
import { useCustomers } from '@/dropdown/useCommonDropDown';
import { ICustomer } from '@/apps/parties/customer';

export default function SaleForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: customers } = useCustomers();

  const isEdit = !!id;

  const { data: sale, isLoading } = useSale(isEdit ? Number(id) : undefined);

  const createSale = useCreateSale();
  const updateSale = useUpdateSale();

  const initialValues: ISale = {
    customerId: sale?.customerId ?? 0,
    date: sale?.date ?? new Date().toISOString(),
    cashReceived: sale?.cashReceived ?? 0,
    currencyId: sale?.currencyId ?? 1,
    notes: sale?.notes ?? '',
    items: sale?.items ?? [
      {
        itemId: 0,
        qty: 1,
        price: 0,
        total: 0
      }
    ]
  };

  const handleSubmit = async (values: ISale) => {
    try {
      if (isEdit) {
        await updateSale.mutateAsync({ id: Number(id), data: values });
      } else {
        await createSale.mutateAsync(values);
      }
      navigate('/sales');
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title={isEdit ? 'Edit Sale' : 'Create New Sale'}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ values, isSubmitting }) => (
          <Form>
            {/* Customer */}
            <WrapInGrid>
              <FormikAutoCompleteField
                {...PropsGenerator.singleAutoComplete<ISale>('customerId')
                  .setAutoCompleteOptions<any>(
                    // @ts-ignore
                    customers || [],
                    new AutoCompleteOptionsSelector<ICustomer>('name', 'id', ['name'])
                  )
                  .render()}
              />
            </WrapInGrid>

            <SaleItemsFieldArray />

            {/* Summary */}
            <SaleBillSummary />

            {/* Actions */}
            <WrapInGrid>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/sales')}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting || values.items.length === 0}>
                  {isEdit ? 'Update Sale' : 'Create Sale'}
                </Button>
              </Box>
            </WrapInGrid>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
}
