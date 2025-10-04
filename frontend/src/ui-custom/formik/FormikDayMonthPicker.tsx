import React, { useMemo } from 'react';
import { getIn, useField, useFormikContext } from 'formik';
import TextFieldProps from '../props/TextFieldProps';
import CustomDayMonthPicker from 'ui-custom/input/CustomDayMonthPicker';

export function FormikDayMonthPicker(props: TextFieldProps) {
    let { values, errors, touched, setFieldValue, handleChange, handleBlur } = useFormikContext<any>();

    const onChange = (e: any) => {
        handleChange(e);
        if (props.onChange) props.onChange(e);
    };
    // @ts-ignore
    let error: any = Boolean(getIn(touched, props.name) && errors[props.name]) ? errors[props.name] : undefined;
    let dateValue = getIn(values, props.name);
    return useMemo(() => {
        return (
            <CustomDayMonthPicker
                {...props}
                setter={setFieldValue}
                value={dateValue}
                error={error}
                onChange={onChange}
                onBlur={handleBlur}
            />
        );
    }, [dateValue, error]);
}

export default FormikDayMonthPicker;
