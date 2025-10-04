import { enqueueWarning } from 'utils/functions/enqueueAlert';

type GuardedDeleteParams<T> = {
    array: T[];
    index: number;
    removeFn: (index: number) => void;
    setPendingIndex: (index: number | null) => void;
    minRequired?: number;
    message?: string;
};

export function guardedDelete<T>({
    array,
    index,
    removeFn,
    setPendingIndex,
    minRequired = 1,
    message = 'At least one item is required'
}: GuardedDeleteParams<T>) {
    // if (minRequired && array.length <= minRequired) {
    //     enqueueWarning(message);
    //     return;
    // }

    setPendingIndex(index);
}

