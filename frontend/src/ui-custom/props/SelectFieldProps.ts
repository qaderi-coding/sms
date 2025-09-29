import BaseInputProps from './BaseInputProps';
import { RootState } from '../../store';

export type dispatchModeType = 'onLoad' | 'onClick';

export class SelectOptionsSelector<T> {
    label: string = '';
    value: string = '';
    disabled?: string;

    constructor(label: keyof T | (keyof T)[], value: keyof T, disabled?: keyof T) {
        this.label = label as string;
        this.value = value as string;
        this.disabled =  disabled as string | undefined;
    }
}

export class SelectReducerAction<T> {
    action: any = () => {};
    selector: (state: RootState) => T[] | undefined = () => undefined;
    dispatchMode: dispatchModeType;
    cacheable: boolean = false;

    constructor(
        action: any,
        selector: (state: RootState) => T[] | undefined,
        dispatchMode: dispatchModeType = 'onLoad',
        cacheable?: boolean
    ) {
        this.action = action;
        this.selector = selector;
        this.dispatchMode = dispatchMode;
        this.cacheable = cacheable === true;
    }
}

export default class SelectFieldProps extends BaseInputProps {
    arrayOptions?: any[];
    reducerOptions: SelectReducerAction<any> = new SelectReducerAction(
        () => {},
        () => undefined
    );
    optionSelector: SelectOptionsSelector<any> = new SelectOptionsSelector<any>('', '');
    multi?: boolean = false;
}
