import React, { memo, useMemo } from 'react';
import { getIn, useField, useFormikContext } from 'formik';
import CustomTextAreaField from '../input/CustomTextAreaField';
import TextAreaFieldProps from '../props/TextAreaFieldProps';

export function FormikTextField(props: TextAreaFieldProps) {
    let [field, meta] = useField(props.name);
    let { errors, touched, submitCount } = useFormikContext();
    // console.log(`${field.name} Formik Text Field Rendered`, field.value);
    // @ts-ignore
    let error = Boolean(getIn(touched, props.name) || submitCount) && errors[props.name] ? errors[props.name] : undefined;
    return useMemo(() => {
        return <CustomTextAreaField {...props} value={field.value} error={error} onChange={field.onChange} onBlur={field.onBlur} />;
    }, [field.value, error]);
}

export default FormikTextField;

