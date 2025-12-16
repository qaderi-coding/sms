import { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

// ==============================|| CUSTOM SELECT DROPDOWN ||============================== //

export default function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  loading = false,
  error = false,
  helperText,
  required = false,
  disabled = false,
  getOptionLabel = (option) => option?.name || option?.label || option?.toString() || '',
  getOptionId = (option) => option?.id,
  placeholder = `Select ${label?.toLowerCase() || 'option'}`,
  freeSolo = false,
  multiple = false,
  sx = {},
  ...props
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled && !loading) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    if (multiple) {
      onChange?.(newValue);
    } else {
      onChange?.(newValue);
    }
  };

  return (
    <Autocomplete
      sx={{ width: '100%', ...sx }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={options}
      loading={loading}
      value={value}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      getOptionKey={(option) => getOptionId(option) || option}
      isOptionEqualToValue={(option, value) => 
        getOptionId(option) === getOptionId(value)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      freeSolo={freeSolo}
      multiple={multiple}
      {...props}
    />
  );
}