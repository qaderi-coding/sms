import { memo, useMemo } from 'react';
import SelectFieldProps from '../props/SelectFieldProps';
import { useField, useFormikContext, getIn } from 'formik';
import CustomSelectField from '../input/CustomSelectField';

function FormikSelectField(props: SelectFieldProps) {
    // console.log(`${props.name} Formik Select Field Rendered`);
    let { touched, errors, setFieldValue, submitCount } = useFormikContext();
    const [field, meta, helpers] = useField(props.name);
    // @ts-ignore
    const error = Boolean(getIn(touched, props.name) || submitCount) && errors[props.name] ? errors[props.name] : undefined;

    const handleChange = async (event: any) => {
        let value = event.target.value;
        if (props.multi && typeof event.target.value === 'string') value = event.target.value.split(',');
        await setFieldValue(field.name, value);
        if (props.onChange) props.onChange(value);
        if (props.onChangeAction) props.onChangeAction(event.target);
    };

    return useMemo(() => {
        return (
            <CustomSelectField
                {...props}
                onChange={handleChange}
                onBlur={() => helpers.setTouched(true, false)}
                value={field.value}
                error={error}
            />
        );
    }, [field.name, field.value, error, props.arrayOptions?.length]);
}

export default FormikSelectField;
