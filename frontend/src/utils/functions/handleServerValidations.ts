import { IValidationError } from '../../store/types/Common';
import { showAlert } from './enqueueAlert';
import { appI18next } from '../../i18n';
import { IDictionary } from '../types/IDictionary';

export function handleServerValidations(error?: any, setErrors?: any) {
    console.log(error);
    console.log('error-rrt');
    if (error?.response && error.response.data) {
        let errors: IValidationError[] | undefined = error?.response?.data?.errors;
        // let errors: IValidationError[] | undefined = error?.response?.data;

        let zodErrors = errors
            ?.filter((error) => {
                // show warning alerts for errors with no property attached
                if (!error.property)
                    showAlert.serverError(error.code + ': ' + appI18next.t(`${error.code}`), {
                        persist: true
                    });
                return error.property;
            })
            .reduce((initial, value) => {
                initial[value.property] = appI18next.t(value.description);
                return initial;
            }, {} as IDictionary<string>);

        if (setErrors && zodErrors) setErrors(zodErrors);
        return zodErrors;
    }
}

