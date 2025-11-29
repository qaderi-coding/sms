import React from 'react';
import { useFormikContext } from 'formik';
import { Box, Paper, Typography, Divider } from '@mui/material';

import FormikTextField from '@/ui-custom/formik/FormikTextField';
import FormikAutoCompleteField from '@/ui-custom/formik/FormikAutoCompleteField';
import WrapInGrid from '@/ui-custom/WrapInGrid';

import PropsGenerator from '@/utils/types/PropsGenerator';
import { ISale } from '../types/saleTypes';

import { useCurrency, usePaymentStatus } from '@/dropdown/useCommonDropDown';
import { AutoCompleteOptionsSelector } from '@/ui-custom/props/AutoCompleteFieldProps';
import { ICustomer, IPaymentStatus } from '@/dropdown/commonDropdownTypes';

export default function SaleBillSummary() {
  const { values } = useFormikContext<ISale>();

  const { data: currencies = [] } = useCurrency();
  const { data: paymentStatuses = [] } = usePaymentStatus();

  // -----------------------------------------
  // NEW: Using item.total instead of totalPrice
  // -----------------------------------------
  const subtotal = values.items.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Bill Summary
      </Typography>

      {/* Currency + Payment Status */}
      <WrapInGrid columns={2}>
        <FormikAutoCompleteField
          {...PropsGenerator.singleAutoComplete<ISale>('currencyId')
            .setAutoCompleteOptions<any>(
              // @ts-ignore
              currencies || [],
              new AutoCompleteOptionsSelector<ICustomer>('name', 'id', ['name'])
            )
            .setLabel('Currency')
            .render()}
        />
        {/* 
        <FormikAutoCompleteField
          {...PropsGenerator.singleAutoComplete<ISale>('')
            .setAutoCompleteOptions<any>(
              // @ts-ignore
              paymentStatuses || [],
              new AutoCompleteOptionsSelector<IPaymentStatus>('name', 'id', ['name'])
            )
            .setLabel('Payment Status')
            .render()}
        /> */}
      </WrapInGrid>

      {/* Calculation Summary */}
      <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mt: 2 }}>
        {/* Subtotal */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Subtotal:</Typography>
          <Typography fontWeight="bold">${subtotal.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Cash Received */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Cash Received:</Typography>

          <FormikTextField {...PropsGenerator.number<ISale>('cashReceived').render()} size="small" sx={{ width: 140 }} />
        </Box>

        {/* Grand Total (just subtotal for display) */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="h6">Grand Total:</Typography>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            ${subtotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Notes */}
      <Box mt={2}>
        <FormikTextField
          {...PropsGenerator.text<ISale>('notes').setLabel('Notes').render()}
          multiline
          rows={3}
          placeholder="Additional notes or comments..."
        />
      </Box>
    </Paper>
  );
}
