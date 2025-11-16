import MainCard from '@/ui-component/MainCard';
import FormikTextField from '@/ui-custom/formik/FormikTextField';
import WrapInGrid from '@/ui-custom/WrapInGrid';
import PropsGenerator from '@/utils/types/PropsGenerator';

import { Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { ICompany } from '../types/companyTypes';
import { useCompany, useCreateCompany, useUpdateCompany } from '../hook/useCompany';

export default function CompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  // ✅ Fetch company if edit
  const { data: company, isLoading } = useCompany(isEdit ? Number(id) : undefined);

  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const initialValues: ICompany = {
    id: company?.id ?? undefined,
    name: company?.name ?? '',
    country: company?.country ?? ''
  };

  const handleSubmit = async (values: ICompany) => {
    if (isEdit) {
      await updateCompany.mutateAsync({ id: Number(id), data: values });
    } else {
      await createCompany.mutateAsync(values);
    }
    navigate('/inventory/companies');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title={isEdit ? 'Edit Company' : 'Create Company'}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {() => (
          <Form>
            <WrapInGrid columns={1}>
              <FormikTextField {...PropsGenerator.text<ICompany>('name').setLabel('Company Name').render()} />
              <FormikTextField {...PropsGenerator.text<ICompany>('country').setLabel('Country').render()} />
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