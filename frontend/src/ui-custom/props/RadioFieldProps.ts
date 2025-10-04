import BaseInputProps from './BaseInputProps';

export default class RadioFieldProps extends BaseInputProps {
    isChecked?: boolean = true;
    truthyValue?: string | boolean = true;
    falsyValue?: string | boolean = false;
}
