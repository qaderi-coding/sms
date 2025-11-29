import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import FormikTextField from '@/ui-custom/formik/FormikTextField';
import PropsGenerator from '@/utils/types/PropsGenerator';
import { ISale, ISaleItem } from '../types/saleTypes';
import { useProducts } from '../../inventory/products/hook/useProduct';
import FormikAutoCompleteField from '@/ui-custom/formik/FormikAutoCompleteField';
import { AutoCompleteOptionsSelector } from '@/ui-custom/props/AutoCompleteFieldProps';
import { IProduct } from '@/apps/inventory/products';

export default function SaleItemsFieldArray() {
  const { values, setFieldValue } = useFormikContext<ISale>();
  const { data: products = [] } = useProducts();

  // -------------------------------
  // ITEM TOTAL CALCULATION
  // -------------------------------
  const calculateItemTotal = (index: number, qty: number, price: number) => {
    const total = qty * price;
    setFieldValue(`items.${index}.total`, total);
    calculateGrandTotal();
  };

  // -------------------------------
  // GRAND TOTAL (updates cashReceived or summary)
  // -------------------------------
  const calculateGrandTotal = () => {
    const subtotal = values.items.reduce((sum, item) => sum + (item.total || 0), 0);
    // you can update total or cashReceived based on your need
    setFieldValue('cashReceived', subtotal);
  };

  // -------------------------------
  // PRODUCT CHANGE HANDLER
  // -------------------------------
  const handleProductChange = (index: number, itemId: number) => {
    const product = products.find((p) => p.id === itemId);
    if (product) {
      setFieldValue(`items.${index}.itemId`, itemId);
      setFieldValue(`items.${index}.price`, product.price);

      const currentQty = values.items[index]?.qty || 1;
      calculateItemTotal(index, currentQty, product.price);
    }
  };

  React.useEffect(() => {
    calculateGrandTotal();
  }, [values.items]);

  return (
    <FieldArray name="items">
      {({ push, remove }) => (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Sale Items</Typography>

            <Button
              startIcon={<AddIcon />}
              onClick={() =>
                push({
                  itemId: 0,
                  qty: 1,
                  price: 0,
                  total: 0
                })
              }
              variant="outlined"
              size="small"
            >
              Add Item
            </Button>
          </Box>

          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell width="40%">Product</TableCell>
                <TableCell width="15%">Qty</TableCell>
                <TableCell width="20%">Price</TableCell>
                <TableCell width="15%">Total</TableCell>
                <TableCell width="10%" align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {values.items.map((item, index) => (
                <TableRow key={index}>
                  {/* PRODUCT SELECTOR */}
                  <TableCell>
                    <FormikAutoCompleteField
                      {...PropsGenerator.singleAutoComplete<ISaleItem>(`items.${index}.itemId`)
                        .setAutoCompleteOptions<any>(products || [], new AutoCompleteOptionsSelector<IProduct>('name', 'id', ['name']))
                        .setLabel('Product')
                        .render()}
                      onChange={(value: number) => handleProductChange(index, value)}
                      fullWidth
                    />
                  </TableCell>

                  {/* QTY */}
                  <TableCell>
                    <FormikTextField
                      {...PropsGenerator.number<ISaleItem>(`items.${index}.qty`).render()}
                      onChange={(e) => {
                        const qty = Number(e.target.value);
                        setFieldValue(`items.${index}.qty`, qty);
                        calculateItemTotal(index, qty, item.price);
                      }}
                      size="small"
                      fullWidth
                    />
                  </TableCell>

                  {/* PRICE */}
                  <TableCell>
                    <FormikTextField
                      {...PropsGenerator.number<ISaleItem>(`items.${index}.price`).render()}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setFieldValue(`items.${index}.price`, price);
                        calculateItemTotal(index, item.qty, price);
                      }}
                      size="small"
                      fullWidth
                    />
                  </TableCell>

                  {/* TOTAL */}
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" align="center">
                      {(item.total || 0).toFixed(2)}
                    </Typography>
                  </TableCell>

                  {/* DELETE BUTTON */}
                  <TableCell align="center">
                    <IconButton onClick={() => remove(index)} color="error" size="small" disabled={values.items.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </FieldArray>
  );
}
