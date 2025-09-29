import { RootState } from 'store';
import BaseInputProps from './BaseInputProps';
import { dispatchModeType, SelectOptionsSelector, SelectReducerAction } from './SelectFieldProps';

export class TableModalOptionsSelector<T> {
    selectionFields: string[] = [];
    columns: string[] = [];

    constructor(selectionFields: (keyof T)[] = [], columns: (keyof T)[] = []) {
        this.selectionFields = selectionFields as string[];
        this.columns = columns as string[];
    }
}

export class TableModalReducerAction<T> {
    action: any = () => {};
    selector: (state: RootState) => T[] | undefined = () => undefined;
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

export class TableModalProps {
    reducerOptions: TableModalReducerAction<any> = new TableModalReducerAction(
        () => {},
        () => undefined
    );
    optionsSelector: TableModalOptionsSelector<any> = new TableModalOptionsSelector<any>([], []);
}
