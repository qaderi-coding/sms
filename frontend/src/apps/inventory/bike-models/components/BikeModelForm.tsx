import MainCard from '@/ui-component/MainCard';
import FormikTextField from '@/ui-custom/formik/FormikTextField';
import FormikSelectField from '@/ui-custom/formik/FormikSelectField';
import WrapInGrid from '@/ui-custom/WrapInGrid';
import PropsGenerator from '@/utils/types/PropsGenerator';

import { Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { IBikeModel } from '../types/bikeModelTypes';
import { useBikeModel, useCreateBikeModel, useUpdateBikeModel } from '../hook/useBikeModel';
import { useCompanies } from '../../companies/hook/useCompany';

export default function BikeModelForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  // ✅ Fetch bike model if edit
  const { data: bikeModel, isLoading } = useBikeModel(isEdit ? Number(id) : undefined);
  const { data: companies = [] } = useCompanies();

  const createBikeModel = useCreateBikeModel();
  const updateBikeModel = useUpdateBikeModel();

  const initialValues: IBikeModel = {
    id: bikeModel?.id ?? undefined,
    companyId: bikeModel?.companyId ?? 0,
    companyName: bikeModel?.companyName ?? '',
    name: bikeModel?.name ?? '',
    description: bikeModel?.description ?? ''
  };

  const handleSubmit = async (values: IBikeModel) => {
    if (isEdit) {
      await updateBikeModel.mutateAsync({ id: Number(id), data: values });
    } else {
      await createBikeModel.mutateAsync(values);
    }
    navigate('/inventory/bike-models');
  };

  if (isLoading) return <div>Loading...</div>;

  const companyOptions = companies.map(company => ({
    value: company.id!,
    label: company.name
  }));

  return (
    <MainCard title={isEdit ? 'Edit Bike Model' : 'Create Bike Model'}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {() => (
          <Form>
            <WrapInGrid columns={1}>
              <FormikSelectField 
                {...PropsGenerator.select<IBikeModel>('companyId')
                  .setLabel('Company')
                  .setOptions(companyOptions)
                  .render()} 
              />
              <FormikTextField {...PropsGenerator.text<IBikeModel>('name').setLabel('Model Name').render()} />
              <FormikTextField {...PropsGenerator.text<IBikeModel>('description').setLabel('Description').render()} />
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