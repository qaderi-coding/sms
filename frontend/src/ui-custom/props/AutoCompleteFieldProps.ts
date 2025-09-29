import BaseInputProps from './BaseInputProps';
import { dispatchModeType, SelectOptionsSelector, SelectReducerAction } from './SelectFieldProps';
import { RootState } from '../../store';

export class AutoCompleteOptionsSelector<T> {
    label: string = '';
    value: string = '';
    columns: string[] = [];

    constructor(label: keyof T | (keyof T)[], value: keyof T, columns: (keyof T)[] = []) {
        this.label = label as string;
        this.value = value as string;
        this.columns = columns as string[];
    }
}

export class AutoCompleteReducerAction<T> {
    action: any = () => undefined;
    selector: (state: RootState) => T[] | undefined;
    dispatchMode: dispatchModeType;
    dispatchData: any;
    cacheable: boolean = false;
    load_count?: number;

    constructor(
        action: any,
        selector: (state: RootState) => T[] | undefined,
        dispatchData: any = undefined,
        dispatchMode: dispatchModeType = 'onClick',
        cacheable?: boolean,
        load_count?: number
    ) {
        this.action = action;
        this.selector = selector;
        this.dispatchMode = dispatchMode;
        this.dispatchData = dispatchData;
        this.cacheable = cacheable === true;
        this.load_count = load_count;
    }
}

export default class AutoCompleteFieldProps extends BaseInputProps {
    arrayOptions?: any[];
    reducerOptions: AutoCompleteReducerAction<any> = new AutoCompleteReducerAction(
        () => {},
        () => undefined
    );
    optionSelector: AutoCompleteOptionsSelector<any> = new AutoCompleteOptionsSelector<any>('', '');
    valueLabel?: any;
    multi?: boolean = false;
}
