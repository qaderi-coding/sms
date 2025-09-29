import { Dictionary, IDictionary } from '../../utils/types/IDictionary';
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export type InputContext = 'form' | 'table';
export type InputFieldType = 'text' | 'number' | 'file' | 'password' | 'email' | 'url' | 'search' | 'tel' | 'color' | 'hidden';
export type FileFieldType = 'single-file' | 'multiple-files';
export type TextAreaFieldType = 'textarea';
export type CheckBoxFieldType = 'checkbox';
export type RadioFieldType = 'radio';
export type SelectFieldType = 'single-select' | 'multiple-select';
export type AutoCompleteFieldType = 'single-complete' | 'multiple-complete';
export type TableModalFieldType = 'table-modal';
export type DatePickerFieldType = 'date' | 'time' | 'datetime' | 'iso';

export type InputType =
    | InputFieldType
    | FileFieldType
    | TextAreaFieldType
    | CheckBoxFieldType
    | RadioFieldType
    | SelectFieldType
    | AutoCompleteFieldType
    | DatePickerFieldType
    | TableModalFieldType
    | 'object';

export interface IBaseInputProps extends IDictionary<any> {
    name: string;
    label?: string;
    value?: any;
    type?: InputType;
    readonly?: boolean;
    translate?: boolean;
    onBlur?: any;
    onChange?: any;
    onClick?: any;
    error?: string;
    sx?: any;
}

export default class BaseInputProps extends Dictionary {
    type?: InputType = 'text';
    name: string = '';
    label?: string = '';
    customValue?: any;
    value?: any;
    prefix?: string = '';
    readonly?: boolean = false;
    translate?: boolean;
    context?: InputContext;
    onChange?: any;
    onChangeAction?: any;
    onDoubleClickAction?: any;
    onEnterClickAction?: any;
    onClick?: any;
    onBlur?: any;
    error?: string;
    sx?: any;
}

