import React, { useMemo } from 'react';
import CheckboxFieldProps from '../props/CheckboxFieldProps';
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
// import { useTranslation } from 'react-i18next';
import { getErrorStatus, getTranslateWhenNotNullOrUndefined } from 'utils/functions/inputHelpers';

export function CustomCheckbox({
  label,
  name,
  value,
  readonly,
  error,
  translate,
  onChange,
  onBlur,
  truthyValue = true,
  falsyValue = false,
  sx
}: CheckboxFieldProps) {
  // const [trans, i18n] = useTranslation();
  // const defaultLabel = useMemo(() => getTranslateWhenNotNullOrUndefined(trans, label, translate), [i18n.resolvedLanguage]);
  const hasError = useMemo(() => getErrorStatus(error), [error]);

  return (
    <FormControl sx={sx}>
      <FormControlLabel
        label={label}
        disabled={readonly === true}
        control={<Checkbox name={name} checked={value === truthyValue} onChange={onChange} onBlur={onBlur} />}
      />
      {hasError && (
        <FormHelperText id={name} error={true}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default CustomCheckbox;
