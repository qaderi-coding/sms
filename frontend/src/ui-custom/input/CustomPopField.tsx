import { useEffect, useRef, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import SelectFieldProps, { SelectReducerAction } from '../props/SelectFieldProps';
import { IDictionary } from '../../utils/types/IDictionary';
import { useDispatch, useSelector } from '../../store';

const style: IDictionary<any> = {
    form: {
        control: {
            margin: '6px 2px 2px 2px',
            width: '98%'
        },
        label: {
            lineHeight: '1em'
        },
        select: {
            fontSize: '0.8rem',
            height: '2.45em'
        }
    },
    table: {
        control: {
            margin: '0',
            width: '100%'
        },
        Select: {
            fontSize: '0.8rem',
            lineHeight: '1.2em',
            height: '0.9em',
            border: '0',
            borderRadius: '0'
        }
    }
};

function CustomPopField({
    name,
    value,
    multi,
    label,
    readonly,
    translate,
    context,
    error,
    onChange,
    onBlur,
    arrayOptions,
    reducerOptions = new SelectReducerAction(
        () => {},
        () => undefined
    ),
    optionSelector,
    sx
}: SelectFieldProps) {
    sx = context === 'table' ? { ...style.table, ...sx } : { ...style.form, ...sx };
    const [selectedItem, setSelectedItem] = useState(value);
    const optionsList = useRef<any[] | undefined>(arrayOptions ? arrayOptions : undefined);
    const dispatch = useDispatch();
    const data = useSelector(reducerOptions.selector);

    // console.log(`Select Field Rendered: ${name} = ${selectedItem}`);
    useEffect(() => {
        dispatch(reducerOptions.action);
    }, []);

    useEffect(() => {
        if (data instanceof Array) optionsList.current = data;
    }, [data]);

    const handleChange = (event: SelectChangeEvent<typeof selectedItem>) => {
        if (multi && typeof event.target.value === 'string') {
            let valuesArray = event.target.value.split(',');
            if (selectedItem.length === valuesArray.length) return;
            setSelectedItem(valuesArray);
        } else {
            if (event.target.value === selectedItem) return;
            setSelectedItem(event.target.value);
        }
    };

    return (
        <FormControl sx={{ ...sx.control }} size="small" onBlur={onBlur}>
            <InputLabel id={`${name}-label`} sx={{ ...sx.label }}>
                {name}
            </InputLabel>
            <Select
                id={name}
                labelId={`${name}-label`}
                label={name}
                name={name}
                value={selectedItem}
                onChange={handleChange}
                onSelect={onBlur}
                multiple={!!multi}
                sx={{ ...sx.select }}
                error={!!error}
            >
                <MenuItem value="0">None</MenuItem>
                {optionsList.current?.map((option) => (
                    <MenuItem value={option[optionSelector.value]} key={option[optionSelector.value]}>
                        {option[optionSelector.label]}
                    </MenuItem>
                ))}
            </Select>

            <FormHelperText style={{ color: '#f44336' }} error={!!error}>
                {error}
            </FormHelperText>
        </FormControl>
    );
}

export default CustomPopField;
