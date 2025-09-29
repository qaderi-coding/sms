import { getIn, useField, useFormikContext } from 'formik';
import { useMemo } from 'react';
import CustomRadio from '../input/CustomRadio';
import RadioFieldProps from '../props/RadioFieldProps';

export function FormikRadio(props: RadioFieldProps) {
    let { touched, errors, setFieldValue } = useFormikContext();
    let [field, meta] = useField(props.name);

    const handleClick = (e: any) => {
        setFieldValue(field.name, e.target.value);
    };
    // @ts-ignore
    let error = Boolean(getIn(touched, props.name) && errors[props.name]) ? errors[props.name] : undefined;

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
