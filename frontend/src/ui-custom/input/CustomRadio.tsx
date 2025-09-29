import React, { useMemo } from 'react';
import { FormControl, FormControlLabel, Radio } from '@mui/material';
import { IDictionary } from '../../utils/types/IDictionary';
import RadioFieldProps from '../props/RadioFieldProps';
// import { useTranslation } from 'react-i18next';

const style: IDictionary<any> = {
  form: {
    control: {
      padding: '5px',
      height: '40px'
    },
    label: {
      height: '40px'
    },
    input: {}
  },
  table: {
    control: {
      padding: '0',
      width: '100%'
    },
    label: {
      marginLeft: '0',
      marginRight: '0'
    },
    input: {
      padding: '6px',
      width: '100%',
      '&:hover': {
        borderRadius: '0',
        backgroundColor: 'rgba(33, 150, 243, 0.1)'
      },
      '& .MuiInputButton-input': {
        width: '32px'
      },
      '& .MuiTouchRipple-root': {
        width: '32px',
        margin: 'auto'
      }
    }
  }
};

export function CustomRadio({
  label,
  name,
  value,
  readonly,
  type,
  error,
  isChecked,
  context,
  translate,
  onChange,
  onBlur,
  onClick,
  sx
}: RadioFieldProps) {
  sx = context === 'table' ? { ...style.table, ...sx } : (sx = { ...style.form, ...sx });
  //   const [trans, i18n] = useTranslation();
  //   const defaultLabel = useMemo(() => {
  //     return context === 'table' ? '' : translate !== false && !!label ? trans(label) : value;
  //   }, [i18n.resolvedLanguage]);

  return (
    <FormControl sx={sx.control}>
      <FormControlLabel
        sx={sx.label}
        label={label}
        disabled={readonly === true}
        control={<Radio size="small" name={name} checked={isChecked} value={value} sx={sx.input} onClick={onClick} onBlur={onBlur} />}
      />
    </FormControl>
  );
}

export default CustomRadio;
