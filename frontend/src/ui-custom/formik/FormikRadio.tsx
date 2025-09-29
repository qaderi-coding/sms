import { getIn, useField, useFormikContext } from 'formik';
import { useEffect, useMemo } from 'react';
import CustomRadio from '../input/CustomRadio';
import RadioFieldProps from '../props/RadioFieldProps';

export function FormikRadio(props: RadioFieldProps) {
    let { touched, errors, setFieldValue } = useFormikContext();
    let [field, meta] = useField(props.name);

    const handleClick = (e: any) => {
        console.log(field.name, e.target.value);
        setFieldValue(field.name, e.target.value);
    };
    // @ts-ignore
    let error = Boolean(getIn(touched, props.name) && errors[props.name]) ? errors[props.name] : undefined;

    useEffect(() => {
        console.log('field value', field.value);
        console.log('props value', props.value);
        // If the value is not set, we can set it to the first option or a default value
    }, []);

    return useMemo(() => {
        return (
            <CustomRadio
                {...props}
                value={props.value}
                isChecked={field.value == props.value}
                error={error}
                onClick={handleClick}
                onBlur={field.onBlur}
            />
        );
    }, [field.value, error]);
}

export default FormikRadio;
