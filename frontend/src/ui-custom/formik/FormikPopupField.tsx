import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { IDictionary } from '../../utils/types/IDictionary';
import PopFieldProps from 'ui-custom/props/PopFieldProps';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const style: IDictionary<any> = {
    form: {
        control: {
            margin: '6px 2px 2px 2px',
            width: '98%',
            height: '2.4em'
        },
        label: {
            fontSize: '0.8em',
            transform: 'translate(14px, 8px) scale(1)',
            '&.MuiInputLabel-shrink': {
                fontSize: '1em',
                transform: 'translate(14px, -8px) scale(0.75)'
            }
        },
        input: {
            height: '2rem'
        }
    },
    table: {
        control: {
            margin: '0',
            width: '100%',
            border: '0',
            borderRadius: '0'
        },
        label: {
            fontSize: '0.8rem',
            lineHeight: '1.2em'
        },
        input: {
            height: '2.5em',
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

function FormikPopupField({ label, name, value, error, onClick, context, translate, sx }: PopFieldProps) {
    sx = context === 'table' ? { ...style.table, ...sx } : { ...style.form, ...sx };
    const [trans] = useTranslation();
    
    const defaultLabel = useMemo(() => {
        return context === 'table' ? '' : translate !== false && !!label ? trans(label) : label;
    }, [context, label, translate]);

    return (
        <FormControl variant="outlined" sx={sx.control}>
            <InputLabel htmlFor={name} sx={sx.label} shrink={!!value}>
                {defaultLabel}
            </InputLabel>
            <OutlinedInput
                id={name}
                label={defaultLabel}
                size={'small'}
                value={value}
                onClick={onClick}
                sx={{ ...sx.input }}
                readOnly
                endAdornment={
                    <InputAdornment position="end">
                        <ArrowDropDownIcon />
                    </InputAdornment>
                }
            />
            {error && (
                <FormHelperText id={name} sx={{ color: '#f44336' }}>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
}

export default FormikPopupField;
