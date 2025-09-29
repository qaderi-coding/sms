import TextFieldProps from '../props/TextFieldProps';
import React, { useMemo } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import AFLocale from '../../utils/locales/DateFnsJalaaliLocale';
// import { useTranslation } from 'react-i18next';
import { getDefaultWhenNullOrUndefined, getErrorStatus, getTranslateWhenNotNullOrUndefined } from 'utils/functions/inputHelpers';
import { toISODate } from 'utils/functions/date';

function CustomDatePicker({
  label,
  name,
  value,
  type,
  error,
  onClick,
  context,
  translate,
  onChange,
  onBlur,
  startAdornment,
  endAdornment,
  setter,
  sx
}: TextFieldProps) {
  // const [trans, i18n] = useTranslation();
  // const defaultLabel = useMemo(() => getTranslateWhenNotNullOrUndefined(trans, label, translate), [i18n.resolvedLanguage]);
  const defaultValue = useMemo(() => getDefaultWhenNullOrUndefined(value), [value]);
  const hasError = useMemo(() => getErrorStatus(error), [error]);

  function setDate(value: Date | null) {
    if (value) {
      const yyyy = value.getFullYear();
      const mm = (value.getMonth() + 1).toString().padStart(2, '0');
      const dd = value.getDate().toString().padStart(2, '0');
      const dateOnly = `${yyyy}-${mm}-${dd}`; // "2025-07-14"
      setter(name, dateOnly);
    } else {
      setter(name, null);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFnsJalali} adapterLocale={AFLocale}>
      <DatePicker
        name={name}
        value={value ? new Date(toISODate(value)) : null}
        label={label}
        onChange={setDate}
        disableFuture
        sx={sx}
        slotProps={{
          textField: {
            error: hasError,
            helperText: hasError ? error : '',
            fullWidth: true
          }
        }}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
