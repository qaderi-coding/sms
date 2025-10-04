import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import TextFieldProps from '../props/TextFieldProps';
import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
import { getDefaultWhenNullOrUndefined, getErrorStatus, getTranslateWhenNotNullOrUndefined } from 'utils/functions/inputHelpers';
import { IBaseInputProps } from '../props/BaseInputProps';

function CustomTextField({
  label,
  name,
  value,
  type,
  readonly,
  error,
  onClick,
  translate,
  onChange,
  onDoubleClickAction,
  onEnterClickAction,
  onBlur,
  startAdornment,
  endAdornment,
  sx
}: IBaseInputProps) {
  //   const [trans, i18n] = useTranslation();
  //   const defaultLabel = useMemo(() => getTranslateWhenNotNullOrUndefined(trans, label, translate), [i18n.resolvedLanguage]);
  const defaultValue = useMemo(() => getDefaultWhenNullOrUndefined(value), [value]);
  const hasError = useMemo(() => getErrorStatus(error), [error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        onEnterClickAction?.(e);
        break;
        // case 'Escape':
        //     onEscapeKeyAction?.();
        //     break;
        // case 'ArrowDown':
        //     onArrowDownKeyAction?.();
        //     break;
        // case 'ArrowUp':
        //     onArrowUpKeyAction?.();
        //     break;
        // default:
        break;
    }
  };
  return (
    <FormControl variant="outlined" sx={sx}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        name={name}
        type={type}
        label={label}
        value={defaultValue}
        disabled={readonly === true}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
        onDoubleClick={onDoubleClickAction}
        onKeyDown={handleKeyDown}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        error={hasError}
        sx={{ sx }}
        autoComplete="off" // 👈 disables the annoying auto typing list
        inputProps={{
          autoComplete: 'off',
          autocomplete: 'off', // For some browsers
          form: { autocomplete: 'off' } // Additional prevention
        }}
      />
      {hasError && (
        <FormHelperText id={name} error={true}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default CustomTextField;
