import React from 'react';
import { Box } from '@mui/system';
import CustomerInfo from '../components/CustomerInfo';

const CustomerFormWrapper: React.FC = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <CustomerInfo />
        </Box>
    );
};

export default CustomerFormWrapper;