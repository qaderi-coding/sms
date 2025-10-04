export interface IDictionary<T> {
    [key: string]: T;
}

export class Dictionary implements IDictionary<any> {
    [key: string]: any;
}

export class ExtendedDictionary implements IDictionary<any> {
    [key: string | number]: any;

    static create(pairs: any[]) {
        let dict = new Dictionary();
        for (const pair of pairs) {
            dict.add(pair[0], pair[1]);
        }
        return dict;
    }

    add(key: string | number, value: any) {
        this[key] = value;
        return this;
    }

    get keys() {
        return Object.keys(this);
    }

    get values() {
        return Object.values(this);
    }
}
