import MainCard from '@/ui-component/MainCard';
import FormikTextField from '@/ui-custom/formik/FormikTextField';
import FormikSelectField from '@/ui-custom/formik/FormikSelectField';
import WrapInGrid from '@/ui-custom/WrapInGrid';
import PropsGenerator from '@/utils/types/PropsGenerator';

import { Button, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import { IProductUnitConversion } from '../types/productUnitConversionTypes';
import { useProductUnitConversion, useCreateProductUnitConversion, useUpdateProductUnitConversion } from '../hook/useProductUnitConversion';
import { useProducts } from '../../products/hook/useProduct';
import { useUnits } from '../../units/hook/useUnit';

export default function ProductUnitConversionForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  // ✅ Fetch conversion if edit
  const { data: conversion, isLoading } = useProductUnitConversion(isEdit ? Number(id) : undefined);
  const { data: products = [] } = useProducts();
  const { data: units = [] } = useUnits();

  const createConversion = useCreateProductUnitConversion();
  const updateConversion = useUpdateProductUnitConversion();

  const initialValues: IProductUnitConversion = {
    id: conversion?.id ?? undefined,
    productId: conversion?.productId ?? 0,
    productName: conversion?.productName ?? '',
    unitId: conversion?.unitId ?? 0,
    unitName: conversion?.unitName ?? '',
    factor: conversion?.factor ?? 1
  };

  const handleSubmit = async (values: IProductUnitConversion) => {
    if (isEdit) {
      await updateConversion.mutateAsync({ id: Number(id), data: values });
    } else {
      await createConversion.mutateAsync(values);
    }
    navigate('/inventory/product-unit-conversions');
  };

  if (isLoading) return <div>Loading...</div>;

  const productOptions = products.map(product => ({
    value: product.id!,
    label: `${product.name} (${product.sku})`
  }));

  const unitOptions = units.map(unit => ({
    value: unit.id!,
    label: `${unit.name} (${unit.symbol})`
  }));

  return (
    <MainCard title={isEdit ? 'Edit Unit Conversion' : 'Create Unit Conversion'}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {() => (
          <Form>
            <WrapInGrid columns={2}>
              <FormikSelectField 
                {...PropsGenerator.select<IProductUnitConversion>('productId')
                  .setLabel('Product')
                  .setOptions(productOptions)
                  .render()} 
              />
              <FormikSelectField 
                {...PropsGenerator.select<IProductUnitConversion>('unitId')
                  .setLabel('Unit')
                  .setOptions(unitOptions)
                  .render()} 
              />
            </WrapInGrid>
            
            <WrapInGrid columns={1}>
              <FormikTextField {...PropsGenerator.number<IProductUnitConversion>('factor').setLabel('Conversion Factor').render()} />
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