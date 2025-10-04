import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'; // If you're using React Router

const UnAuthorized = () => {
    const navigate = useNavigate(); // Optional: handle navigation

    const handleBackToHome = () => {
        navigate('/'); // Or any other path
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.default',
                px: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    borderRadius: 3
                }}
            >
                <LockOutlinedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

                <Typography variant="h4" color="textPrimary" gutterBottom>
                    Unauthorized Access
                </Typography>

                <Typography variant="body1" color="textSecondary" mb={3}>
                    You do not have permission to view this page.
                </Typography>

                <Button variant="contained" color="primary" onClick={handleBackToHome} sx={{ borderRadius: 8 }}>
                    Go to Home
                </Button>
            </Paper>
        </Box>
    );
};

export default UnAuthorized;
