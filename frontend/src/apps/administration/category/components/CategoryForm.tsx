import MainCard from '@/ui-component/MainCard';
import FormikTextField from '@/ui-custom/formik/FormikTextField';
import WrapInGrid from '@/ui-custom/WrapInGrid';
import PropsGenerator from '@/utils/types/PropsGenerator';

import { Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { ICategory } from '../types/categoryTypes';
import { useCategory, useCreateCategory, useUpdateCategory } from '../hook/useCategory';

export default function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  // ✅ Fetch category if edit
  const { data: category, isLoading } = useCategory(isEdit ? Number(id) : undefined);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const initialValues: ICategory = {
    id: category?.id ?? undefined,
    name: category?.name ?? '',
    description: category?.description ?? ''
  };

  const handleSubmit = async (values: ICategory) => {
    if (isEdit) {
      await updateCategory.mutateAsync({ id: Number(id), data: values });
    } else {
      await createCategory.mutateAsync(values);
    }
    navigate('/category/list');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <MainCard title={isEdit ? 'Edit Category' : 'Create Category'}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {() => (
          <Form>
            <WrapInGrid columns={1}>
              <FormikTextField {...PropsGenerator.text<ICategory>('name').setLabel('Name').render()} />

              <FormikTextField {...PropsGenerator.text<ICategory>('description').setLabel('Description').render()} />
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
