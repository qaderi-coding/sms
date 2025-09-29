import { forwardRef, ReactNode } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel';

// ==============================|| CUSTOM INPUT LABEL ||============================== //

interface Props extends InputLabelProps {
  children: ReactNode;
}

const InputLabel = forwardRef<HTMLLabelElement, Props>(({ children, ...other }, ref) => {
  const theme = useTheme();

  return (
    <MuiInputLabel
      ref={ref}
      sx={{
        color: theme.palette.text.primary,
        fontWeight: 500,
        marginBottom: 1,
        ...other.sx
      }}
      {...other}
    >
      {children}
    </MuiInputLabel>
  );
});

InputLabel.displayName = 'InputLabel';

export default InputLabel;