import { IDictionary } from '../types/IDictionary';
import { SelectItem } from '../types/SelectItem';

export function createSelectItem<T>(values: any[], label: keyof T, value: keyof T) {
    const list = values.map((value) => {
        const entity = value as IDictionary<any>;
        return new SelectItem(entity[label as string], entity[value as string]);
    });
    return list;
}
