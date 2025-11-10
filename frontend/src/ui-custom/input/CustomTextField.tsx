import { FormControl, FormHelperText, InputLabel, OutlinedInput, Stack, InputAdornment } from '@mui/material';
import { useMemo } from 'react';
import { getDefaultWhenNullOrUndefined, getErrorStatus } from 'utils/functions/inputHelpers';
import { IBaseInputProps } from '../props/BaseInputProps';

interface ICustomTextFieldProps extends IBaseInputProps {
  formik?: any; // Optional Formik instance
  required?: boolean;
}

const CustomTextField = ({
  label,
  name,
  value,
  type = 'text',
  readonly,
  error,
  onClick,
  onChange,
  onBlur,
  startAdornment,
  endAdornment,
  sx,
  formik,
  required = false,
  placeholder
}: ICustomTextFieldProps) => {
  // Determine value and error from Formik if provided
  const fieldValue = formik ? formik.values[name] : value;
  const fieldError = formik ? (formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined) : error;

  const defaultValue = useMemo(() => getDefaultWhenNullOrUndefined(fieldValue), [fieldValue]);
  const hasError = useMemo(() => getErrorStatus(fieldError), [fieldError]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onClick) onClick(e as any);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={sx}>
      {/* <Stack spacing={0.5}> */}
      <InputLabel htmlFor={name} required={required} sx={{ color: 'grey.700', fontWeight: 500 }}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={name}
        name={name}
        type={type}
        label={label}
        value={defaultValue}
        placeholder={placeholder}
        disabled={readonly}
        onChange={formik ? formik.handleChange : onChange}
        onBlur={formik ? formik.handleBlur : onBlur}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        startAdornment={startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : undefined}
        endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined}
        error={hasError}
        sx={{ ...sx }}
        autoComplete="off"
        inputProps={{
          autoComplete: 'off',
          form: { autoComplete: 'off' }
        }}
      />
      {hasError && <FormHelperText error>{fieldError}</FormHelperText>}
      {/* </Stack> */}
    </FormControl>
  );
};

export default CustomTextField;
