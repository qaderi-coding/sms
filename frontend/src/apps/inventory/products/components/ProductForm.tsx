import MainCard from '@/ui-component/MainCard';
import FormikTextField from '@/ui-custom/formik/FormikTextField';
import FormikSelectField from '@/ui-custom/formik/FormikSelectField';
import WrapInGrid from '@/ui-custom/WrapInGrid';
import PropsGenerator from '@/utils/types/PropsGenerator';

import { Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { IProduct } from '../types/productTypes';
import { useProduct, useCreateProduct, useUpdateProduct } from '../hook/useProduct';
import { useCompanies } from '../../companies/hook/useCompany';
import { useBikeModels } from '../../bike-models/hook/useBikeModel';
import { useUnits } from '../../units/hook/useUnit';
import { useCategories } from '../../../administration/category/hook/useCategory';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  // ✅ Fetch product if edit
  const { data: product, isLoading } = useProduct(isEdit ? Number(id) : undefined);
  const { data: companies = [] } = useCompanies();
  const { data: bikeModels = [] } = useBikeModels();
  const { data: units = [] } = useUnits();
  const { data: categories = [] } = useCategories();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const initialValues: IProduct = {
    id: product?.id ?? undefined,
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    price: product?.price ?? 0,
    stockQuantity: product?.stockQuantity ?? 0,
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? 0,
    categoryName: product?.categoryName ?? '',
    companyId: product?.companyId ?? 0,
    companyName: product?.companyName ?? '',
    bikeModelId: product?.bikeModelId ?? undefined,
    bikeModelName: product?.bikeModelName ?? '',
    baseUnitId: product?.baseUnitId ?? 0,
    baseUnitName: product?.baseUnitName ?? ''
  };

  const handleSubmit = async (values: IProduct) => {
    if (isEdit) {
      await updateProduct.mutateAsync({ id: Number(id), data: values });
    } else {
      await createProduct.mutateAsync(values);
    }
    navigate('/inventory/products');
  };

  if (isLoading) return <div>Loading...</div>;

  const companyOptions = companies.map(company => ({
    value: company.id!,
    label: company.name
  }));

  const bikeModelOptions = bikeModels.map(model => ({
    value: model.id!,
    label: model.name
  }));

  const unitOptions = units.map(unit => ({
    value: unit.id!,
    label: `${unit.name} (${unit.symbol})`
  }));

  const categoryOptions = categories.map(category => ({
    value: category.id!,
    label: category.name
  }));

  return (
    <MainCard title={isEdit ? 'Edit Product' : 'Create Product'}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {() => (
          <Form>
            <WrapInGrid columns={2}>
              <FormikTextField {...PropsGenerator.text<IProduct>('name').setLabel('Product Name').render()} />
              <FormikTextField {...PropsGenerator.text<IProduct>('sku').setLabel('SKU').render()} />
              
              <FormikTextField {...PropsGenerator.number<IProduct>('price').setLabel('Price').render()} />
              <FormikTextField {...PropsGenerator.number<IProduct>('stockQuantity').setLabel('Stock Quantity').render()} />
              
              <FormikSelectField 
                {...PropsGenerator.select<IProduct>('categoryId')
                  .setLabel('Category')
                  .setOptions(categoryOptions)
                  .render()} 
              />
              <FormikSelectField 
                {...PropsGenerator.select<IProduct>('companyId')
                  .setLabel('Company')
                  .setOptions(companyOptions)
                  .render()} 
              />
              
              <FormikSelectField 
                {...PropsGenerator.select<IProduct>('bikeModelId')
                  .setLabel('Bike Model (Optional)')
                  .setOptions(bikeModelOptions)
                  .render()} 
              />
              <FormikSelectField 
                {...PropsGenerator.select<IProduct>('baseUnitId')
                  .setLabel('Base Unit')
                  .setOptions(unitOptions)
                  .render()} 
              />
            </WrapInGrid>
            
            <WrapInGrid columns={1}>
              <FormikTextField {...PropsGenerator.text<IProduct>('description').setLabel('Description').render()} />
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