import BaseInputProps, { IBaseInputProps } from './BaseInputProps';

export interface ITextFieldProps extends IBaseInputProps {
    startAdornment?: any;
    endAdornment?: any;
}

export default class TextFieldProps extends BaseInputProps {
    startAdornment?: any = undefined;
    endAdornment?: any = undefined;
    setter?: any;
}
