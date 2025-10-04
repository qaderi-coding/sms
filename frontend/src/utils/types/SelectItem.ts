export interface SelectItem {
    label: string | number;
    value: string | number;
}

export class SelectItem implements SelectItem {
    label: string | number;
    value: string | number;

    constructor(label: string, value: string | number, ) {
        this.label = label;
        this.value = value;
    }
}
