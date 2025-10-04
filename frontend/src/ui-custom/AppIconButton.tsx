import { Add, AddCircleOutline, AddCircleOutlined, Delete } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';

const squareStyle = {
    width: 24,
    height: 24,
    borderRadius: 4
};

export const AppIconButton = styled(IconButton)(({ theme }) => ({
    ...squareStyle,
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    }
}));

export const PrimaryIconButtonStyled = styled(IconButton)(({ theme, disabled }) => ({
    ...squareStyle,
    margin: '0 5px',
    border: `1px solid ${disabled ? theme.palette.grey[400] : theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: disabled ? 'transparent' : theme.palette.action.hover
    }
}));

export const ErrorIconButtonStyled = styled(IconButton)(({ theme, disabled }) => ({
    ...squareStyle,
    border: `1px solid ${disabled ? theme.palette.grey[400] : theme.palette.error.main}`,
    color: theme.palette.error.main,
    '&:hover': {
        backgroundColor: disabled ? 'transparent' : theme.palette.action.hover
    }
}));

export interface IconButtonProps {
    disabled?: boolean;
    onClick?: any;
}

export function AddIconButton(props: IconButtonProps) {
    return (
        <PrimaryIconButtonStyled disabled={props.disabled == true} size={'small'} {...props}>
            <Add fontSize={'small'} />
        </PrimaryIconButtonStyled>
    );
}

export function DeleteIconButton(props: IconButtonProps) {
    return (
        <ErrorIconButtonStyled disabled={props.disabled == true} size={'small'} {...props}>
            <Delete fontSize={'small'} />
        </ErrorIconButtonStyled>
    );
}
