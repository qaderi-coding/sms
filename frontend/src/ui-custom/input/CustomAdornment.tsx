import { IconButton, InputAdornment } from '@mui/material';
import React from 'react';

export interface CustomAdornmentProps {
    icon?: any;
    readonly?: boolean;
    onClick?: any;
}

export default function CustomAdornment({ icon, readonly, onClick}: CustomAdornmentProps) {
    return (
        <InputAdornment
            position="end"
            sx={{
                '& .MuiButtonBase-root': {
                    padding: '2px',
                    borderRadius: '25%',
                    '&:hover': {
                        backgroundColor: '#1e88e5',
                        color: 'rgba(255,255,255,0.9)'
                    }
                },
                '& .MuiTouchRipple-root': {
                    borderRadius: '25%',
                }
            }}
        >
            <IconButton onClick={onClick} edge="end">
                {icon}
            </IconButton>
        </InputAdornment>
    );
}
