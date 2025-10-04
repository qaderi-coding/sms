import React, { useMemo } from 'react';
import { getIn, useFormikContext } from 'formik';
import TextFieldProps from '../props/TextFieldProps';
import CustomDatePicker from '../input/CustomDatePicker';

export function FormikDatePicker(props: TextFieldProps) {
    const { values, errors, touched, setFieldValue, handleChange, handleBlur } = useFormikContext<any>();

    const dateValue = getIn(values, props.name);

    const nestedError = getIn(errors, props.name);
    const flatError = errors?.[props.name];

    // ✅ Show error regardless of touched state
    const error = flatError || nestedError;

    const onChange = (e: any) => {
        handleChange(e);
        if (props.onChange) props.onChange(e);
    };

    return useMemo(() => {
        return (
            <CustomDatePicker {...props} setter={setFieldValue} value={dateValue} error={error} onChange={onChange} onBlur={handleBlur} />
        );
    }, [dateValue, error]);
}

export default FormikDatePicker;

