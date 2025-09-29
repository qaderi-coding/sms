import { TFunction } from 'i18next';
import { appI18next } from '../../i18n';

// function trans(key?: string, options: any = {}) {
//     // const intl = createIntl();
//     return <FormattedMessage id={key} values={{ ...options }} key={key} />;
// }
//
// export function transList(keys?: string[], options: any = {}) {
//     return keys?.map((key) => <FormattedMessage id={key} values={{ ...options }} key={key} />);
// }

function transList(trans: TFunction<'translation', undefined>, keys: string[], options: any = {}) {
    return keys.map((key) => trans(key)) as string[];
}

function transAsObject(key?: string, options: any = {}) {
    return key === undefined ? {} : (appI18next.t(key, { returnObjects: true, ...options }) as object);
}

const trans = (word: string) => appI18next.t(word);

export { transList, transAsObject, trans };
