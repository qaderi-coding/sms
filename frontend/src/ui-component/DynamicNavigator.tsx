import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface NavigatorProps {
    currentIndex: number; // Current index of the data
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>; // State setter for currentIndex
    totalItems: number; // Total number of items
}

const DynamicNavigator: React.FC<NavigatorProps> = ({ currentIndex, setCurrentIndex, totalItems }) => {
    const handleNext = () => {
        if (currentIndex < totalItems - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{
                backgroundColor: 'background.paper',
                padding: 2,
                borderRadius: 1,
                boxShadow: 2,
                width: '100%',
                maxWidth: 300,
                margin: 'auto'
            }}
        >
            <IconButton color="primary" onClick={handlePrevious} disabled={currentIndex === 0} title="Previous">
                <ArrowBack />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {`${currentIndex + 1} / ${totalItems}`}
            </Typography>
            <IconButton color="primary" onClick={handleNext} disabled={currentIndex === totalItems - 1} title="Next">
                <ArrowForward />
            </IconButton>
        </Box>
    );
};

export default DynamicNavigator;
