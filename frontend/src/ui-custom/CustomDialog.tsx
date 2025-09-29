import React, { ForwardedRef, forwardRef, memo, useImperativeHandle } from 'react';
import { Breakpoint, Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface CustomDialogActions {
    showModal: () => void;
    hideModal: () => void;
}

interface CustomDialogProps {
    title?: string | React.ReactNode;
    isOpen?: boolean;
    onOpen?: any;
    onClose?: any;
    maxWidth?: false | Breakpoint | undefined;
    children?: any;
}

function CustomDialog({ title, isOpen, onOpen, onClose, maxWidth, children }: CustomDialogProps, ref: ForwardedRef<any>) {
    const [open, setOpen] = React.useState(isOpen === true);

    const handleOpen = () => {
        setOpen(true);
        if (onOpen) setTimeout(onOpen, 100);
    };
    const handleClose = () => {
        if (onClose) onClose();
        setOpen(false);
    };

    useImperativeHandle(ref, (): CustomDialogActions => {
        return {
            showModal: handleOpen,
            hideModal: handleClose
        };
    });

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={maxWidth ? maxWidth : 'sm'} fullWidth>
            <DialogTitle sx={{ padding: '0px 24px 10px 24px' }}>{title}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme: any) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500]
                })}
            >
                <CloseIcon />
            </IconButton>
            <Divider orientation="horizontal" sx={{ width: '100%' }} />
            <DialogContent sx={{ padding: '10px 24px' }}>{children}</DialogContent>
        </Dialog>
    );
}

export default memo(forwardRef(CustomDialog));
