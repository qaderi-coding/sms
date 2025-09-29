import { memo, useMemo } from 'react';
import SelectFieldProps from '../props/SelectFieldProps';
import { useField, useFormikContext, getIn } from 'formik';
import CustomSelectField from '../input/CustomSelectField';
import CustomAutoCompleteField from '../input/CustomAutoCompleteField';
import AutoCompleteFieldProps from '../props/AutoCompleteFieldProps';

function FormikAutoCompleteField(props: AutoCompleteFieldProps) {
    // console.log(`${props.name} Formik Select Field Rendered`);
    let { touched, errors, setFieldValue, submitCount } = useFormikContext();
    const [field, meta, helpers] = useField(props.name);
    // @ts-ignore
    const error = Boolean(getIn(touched, props.name) || submitCount) && errors[props.name] ? errors[props.name] : undefined;

    const handleChange = async (event: any, newValue: any) => {
        await setFieldValue(field.name, newValue ? newValue[props.optionSelector.value] : null);
        console.log(newValue);
        console.log('inside function');
        if (props.onChange) props.onChange(newValue);
        if (props.onChangeAction) props.onChangeAction(newValue);
    };

    return useMemo(() => {
        return (
            <CustomAutoCompleteField
                {...props}
                value={field.value}
                onChange={handleChange}
                onBlur={() => helpers.setTouched(true, false)}
                error={error}
            />
        );
    }, [props.arrayOptions, field.name, field.value, error]);
}

export default memo(FormikAutoCompleteField);
