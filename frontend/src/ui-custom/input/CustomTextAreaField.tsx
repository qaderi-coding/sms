import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import TextFieldProps from '../props/TextFieldProps';
import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
import { getDefaultWhenNullOrUndefined, getErrorStatus, getTranslateWhenNotNullOrUndefined } from 'utils/functions/inputHelpers';
import { IDictionary } from '../../utils/types/IDictionary';

const style: IDictionary<any> = {
  form: {
    control: {
      margin: '6px 2px 2px 2px',
      width: '98%'
    },
    label: {
      fontSize: '0.8em',
      transform: 'translate(14px, 12px) scale(1)',
      '&.MuiInputLabel-shrink': {
        fontSize: '1em',
        transform: 'translate(14px, -8px) scale(0.75)'
      }
    },
    input: {
      // height: '2rem'
    }
  },
  table: {
    control: {
      height: '100%',
      margin: '0.1',
      padding: '0',
      width: '100%',
      border: '0',
      borderRadius: '0'
    },
    label: {
      fontSize: '0.8rem',
      lineHeight: '1.2em',
      transform: 'translate(14px, 8px) scale(1)',
      '&.MuiInputLabel-shrink': {
        fontSize: '1em',
        transform: 'translate(14px, -8px) scale(0.75)'
      }
    },
    input: {
      height: '100%',
      '& .MuiInputBase-input': {
        padding: '6px 10px'
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: '0',
        borderRadius: '0'
      }
    }
  }
};

function CustomTextAreaField({
  label,
  name,
  value,
  type,
  error,
  onClick,
  translate,
  onChange,
  onBlur,
  startAdornment,
  endAdornment,
  sx
}: TextFieldProps) {
  //   const [trans, i18n] = useTranslation();
  //   const defaultLabel = useMemo(() => getTranslateWhenNotNullOrUndefined(trans, label, translate), [i18n.resolvedLanguage]);
  const defaultValue = useMemo(() => getDefaultWhenNullOrUndefined(value), [value]);
  const hasError = useMemo(() => getErrorStatus(error), [error]);

  return (
    <FormControl variant="outlined" sx={sx}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        name={name}
        type={type}
        label={label}
        value={defaultValue}
        rows={3}
        multiline={true}
        onBlur={onBlur}
        onChange={onChange}
        onClick={onClick}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        error={hasError}
      />
      {hasError && <FormHelperText error={true}>{error}</FormHelperText>}
    </FormControl>
  );
}

export default CustomTextAreaField;
