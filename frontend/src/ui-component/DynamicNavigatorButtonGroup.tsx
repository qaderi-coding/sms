import React from 'react';
import { Button, ButtonGroup, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const DynamicNavigatorButtonGroup = ({
    currentIndex,
    totalItems,
    setCurrentIndex
}: {
    currentIndex: number; // Current index of the data
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>; // State setter for currentIndex
    totalItems: number; // Total number of items
}) => {
    // Handle previous click
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Handle next click
    const handleNext = () => {
        if (currentIndex < totalItems - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <ButtonGroup size="small" aria-label="Small button group">
            <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ display: 'flex' }} color="textSecondary" d-flex alignItems="center" justifyContent="center">
                {`Item ${currentIndex + 1} of ${totalItems}`}
            </Typography>
            <IconButton onClick={handleNext} disabled={currentIndex === totalItems - 1}>
                <ArrowForward />
            </IconButton>
        </ButtonGroup>
    );
};

export default DynamicNavigatorButtonGroup;
