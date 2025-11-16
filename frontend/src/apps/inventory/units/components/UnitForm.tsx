import MainCard from '@/ui-component/MainCard';
import FormikTextField from '@/ui-custom/formik/FormikTextField';
import WrapInGrid from '@/ui-custom/WrapInGrid';
import PropsGenerator from '@/utils/types/PropsGenerator';

import { Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { IUnit } from '../types/unitTypes';
import { useUnit, useCreateUnit, useUpdateUnit } from '../hook/useUnit';

export default function UnitForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  // ✅ Fetch unit if edit
  const { data: unit, isLoading } = useUnit(isEdit ? Number(id) : undefined);

  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();

  const initialValues: IUnit = {
    id: unit?.id ?? undefined,
    name: unit?.name ?? '',
    symbol: unit?.symbol ?? ''
  };

  const handleSubmit = async (values: IUnit) => {
    if (isEdit) {
      await updateUnit.mutateAsync({ id: Number(id), data: values });
    } else {
      await createUnit.mutateAsync(values);
    }
    navigate('/inventory/units');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title={isEdit ? 'Edit Unit' : 'Create Unit'}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {() => (
          <Form>
            <WrapInGrid columns={2}>
              <FormikTextField {...PropsGenerator.text<IUnit>('name').setLabel('Unit Name').render()} />
              <FormikTextField {...PropsGenerator.text<IUnit>('symbol').setLabel('Symbol').render()} />
            </WrapInGrid>

            <Box mt={3}>
              <Button type="submit" variant="contained">
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
}