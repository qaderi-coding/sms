import React, { memo } from 'react';
import { getIn, useField, useFormikContext } from 'formik';
import TextFieldProps from '../props/TextFieldProps';
import CustomTextField from '../input/CustomTextField';

function toEnglishDigits(input: string): string {
    const persianArabicNums: Record<string, string> = {
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9',
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9'
    };
    return input.replace(/[۰-۹٠-٩]/g, (d) => persianArabicNums[d] || d);
}

export function FormikTextField(props: TextFieldProps) {
    const [field, meta] = useField(props.name);
    let { errors, touched, submitCount, setFieldValue } = useFormikContext();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const normalized = toEnglishDigits(e.target.value);
        setFieldValue(props.name, normalized);
        if (props.onChange) props.onChange(e);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        field.onBlur(e);
        if (props.onBlur) props.onBlur(e);
    };

    // const error = (getIn(touched, props.name) || submitCount) && getIn(errors, props.name) ? getIn(errors, props.name) : undefined;
    // @ts-ignore
    let error = Boolean(getIn(touched, props.name) || submitCount) && errors[props.name] ? errors[props.name] : undefined;

    return <CustomTextField {...props} value={field.value} onChange={onChange} onBlur={onBlur} error={error} />;
}

export default FormikTextField;

