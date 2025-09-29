import { getIn, useField, useFormikContext } from 'formik';
import CheckboxFieldProps from '../props/CheckboxFieldProps';
import CustomCheckbox from '../input/CustomCheckbox';
import { useMemo } from 'react';

export function FormikCheckboxField(props: CheckboxFieldProps) {
    let { touched, errors, setFieldValue } = useFormikContext();
    let [field, meta] = useField(props.name);

    const onChange = (e: any) => {
        setFieldValue(field.name, e.target.checked ? props.truthyValue : props.falsyValue);
        if (props.onChange) props.onChange(e);
    };
    const handleChange = (e: any) => setFieldValue(field.name, e.target.checked ? props.truthyValue : props.falsyValue);
    // @ts-ignore
    let error = Boolean(getIn(touched, props.name) && errors[props.name]) ? errors[props.name] : undefined;

    return useMemo(() => {
        return <CustomCheckbox {...props} value={field.value} error={error} onChange={onChange} onBlur={field.onBlur} />;
    }, [field.value, error]);
}

export default FormikCheckboxField;
