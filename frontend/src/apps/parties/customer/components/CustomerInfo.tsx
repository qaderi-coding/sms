import React from 'react';
import MainCard from 'ui-component/MainCard';
import FormikTextField from 'ui-custom/formik/FormikTextField';
import FormikCheckboxField from 'ui-custom/formik/FormikCheckboxField';
import WrapInGrid from 'ui-custom/WrapInGrid';
import PropsGenerator from 'utils/types/PropsGenerator';
import { ICustomer } from '../redux/CustomerTypes';

const CustomerInfo: React.FC = () => {
  return (
    <MainCard sx={{ marginBottom: 1 }}>
      <WrapInGrid columns={2} lg={12}>
        <WrapInGrid>
          <FormikTextField {...PropsGenerator.text<ICustomer>('name').render()} />
          <FormikTextField {...PropsGenerator.text<ICustomer>('email').render()} />
          <FormikTextField {...PropsGenerator.text<ICustomer>('phone').render()} />
        </WrapInGrid>
        <WrapInGrid>
          <FormikTextField {...PropsGenerator.text<ICustomer>('address').render()} />
          <FormikTextField {...PropsGenerator.text<ICustomer>('city').render()} />
          <FormikTextField {...PropsGenerator.text<ICustomer>('country').render()} />
          <FormikCheckboxField {...PropsGenerator.checkbox<ICustomer>('isActive').render()} />
        </WrapInGrid>
      </WrapInGrid>
    </MainCard>
  );
};

export default CustomerInfo;
