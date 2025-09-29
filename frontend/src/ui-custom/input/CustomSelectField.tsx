import { useEffect, useMemo, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import SelectFieldProps, { SelectOptionsSelector, SelectReducerAction } from '../props/SelectFieldProps';
import { IDictionary } from '../../utils/types/IDictionary';
import { useDispatch, useSelector } from '../../store';
// import { useTranslation } from 'react-i18next';
import {
  getDefaultWhenArrayNullOrUndefined,
  getDefaultWhenNullOrUndefined,
  getErrorStatus,
  getTranslateWhenNotNullOrUndefined
} from '../../utils/functions/inputHelpers';

function CustomSelectField({
  name,
  value,
  multi,
  label,
  readonly,
  translate,
  error,
  onChange,
  onBlur,
  arrayOptions,
  reducerOptions = new SelectReducerAction(
    () => undefined,
    () => undefined
  ),
  optionSelector = new SelectOptionsSelector<any>('', ''),
  sx
}: SelectFieldProps) {
  //   const [trans, i18n] = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector(reducerOptions.selector);
  const [optionsList, setOptionsList] = useState<any[] | undefined>(arrayOptions);
  //   const defaultLabel = useMemo(() => getTranslateWhenNotNullOrUndefined(trans, label, translate), [i18n.resolvedLanguage]);
  const defaultValue = useMemo(() => getDefaultWhenArrayNullOrUndefined(optionsList, optionSelector.value, value), [optionsList, value]);
  const hasError = useMemo(() => getErrorStatus(error), [error]);
  const hasMulti = useMemo(() => multi === true, [multi]);

  useEffect(() => {
    setOptionsList(arrayOptions);
  }, [arrayOptions]);

  useEffect(() => {
    if (arrayOptions == undefined || data instanceof Array) {
      dispatch(reducerOptions.action);
    }
  }, []);

  useEffect(() => {
    if (data instanceof Array) setOptionsList(data);
  }, [data]);

  return (
    <FormControl
      onBlur={onBlur}
      disabled={readonly}
      sx={sx}
      error={hasError} // Only set error on FormControl
    >
      <InputLabel htmlFor={name} error={hasError}>
        {label}
      </InputLabel>
      <Select
        name={name}
        label={label}
        value={defaultValue}
        disabled={readonly === true}
        onChange={onChange}
        onBlur={onBlur}
        multiple={hasMulti}

        // Remove error prop from Select - FormControl handles it
      >
        <MenuItem value="">None</MenuItem>
        {optionsList?.map((option, index) => (
          <MenuItem
            value={option[optionSelector.value]}
            disabled={optionSelector.disabled ? option[optionSelector.disabled] : false}
            key={index}
          >
            {option[optionSelector.label]}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText error={true}>{error}</FormHelperText>}
    </FormControl>
  );
}

export default CustomSelectField;
