import { Box, Button } from '@mui/material';
import { Formik } from 'formik';
import React, { useCallback } from 'react';
import TitleBar from 'ui-custom/TitleBar';
import { CustomerValidation, ICustomer } from '../redux/CustomerTypes';
import { useSelector, useAppDispatch } from 'store';
import { CustomerActions } from '../redux/CustomerSlice';
import { applyZodValidations } from 'utils/types/FormikZodWrapper';
import CustomerFormWrapper from './CustomerFormWrapper';
import Loader from 'ui-component/Loader';

interface CreateCustomerProps {
    onSuccess?: () => void;
}

const CreateCustomer: React.FC<CreateCustomerProps> = ({ onSuccess }) => {
    const { customer, loading } = useSelector((state) => state.customer);
    const dispatch = useAppDispatch();

    const handleSubmit = useCallback(async (values: ICustomer, setErrors: any) => {
        try {
            if (values?.id) {
                await dispatch(CustomerActions.update(values, setErrors));
            } else {
                await dispatch(CustomerActions.create(values, setErrors));
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    }, [dispatch, onSuccess]);

    const handleSearch = (customerId: number) => {
        dispatch(CustomerActions.getById(customerId));
    };

    const handleReset = () => {
        dispatch(CustomerActions.clear());
    };

    return (
        <div>
            <Formik
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                initialValues={customer}
                validate={applyZodValidations(CustomerValidation)}
                onSubmit={(values, helpers) => handleSubmit(values, helpers.setErrors)}
            >
                {({ handleSubmit, handleReset: formikReset, isSubmitting, values }) => (
                    <Box>
                        {loading && <Loader />}
                        <CustomerFormWrapper />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={() => { formikReset(); handleReset(); }} disabled={isSubmitting}>
                                Reset
                            </Button>
                            <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
                                {values?.id ? 'Update' : 'Create'} Customer
                            </Button>
                        </Box>
                    </Box>
                )}
            </Formik>
        </div>
    );
};

export default CreateCustomer;