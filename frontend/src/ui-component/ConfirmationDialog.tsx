import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    Typography,
    ButtonGroup,
    Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmButtonColor?: 'error' | 'primary' | 'secondary';
    cancelButtonColor?: 'error' | 'primary' | 'secondary';
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    title,
    message,
    confirmLabel = 'Ok',
    cancelLabel = 'Cancel',
    confirmButtonColor = 'error',
    cancelButtonColor = 'secondary',
    onConfirm,
    onCancel
}) => {
    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="dialog-title" aria-describedby="dialog-description" fullWidth maxWidth="sm">
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    <Typography variant="body2">{message}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={2} width="100%" justifyContent="flex-end">
                    <ButtonGroup variant="contained">
                        <Button onClick={onCancel} color={cancelButtonColor} startIcon={<CancelIcon />}>
                            {cancelLabel}
                        </Button>
                        <Button onClick={onConfirm} color={confirmButtonColor} startIcon={<CheckCircleIcon />}>
                            {confirmLabel}
                        </Button>
                    </ButtonGroup>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
