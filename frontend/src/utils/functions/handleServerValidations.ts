import { showAlert } from './enqueueAlert';
import { IDictionary } from '../types/IDictionary';

export function handleServerValidations(error?: any, setErrors?: any) {
  console.log(error);
  console.log('error-rrt');
  if (error?.response && error.response.data) {
    let errors: any[] | undefined = error?.response?.data?.errors;
    // let errors: IValidationError[] | undefined = error?.response?.data;

    let zodErrors = errors
      ?.filter((error) => {
        // show warning alerts for errors with no property attached
        if (!error.property)
          showAlert.serverError(error.code + ': ' + `${error.code}`, {
            persist: true
          });
        return error.property;
      })
      .reduce((initial, value) => {
        initial[value.property] = value.description;
        return initial;
      }, {} as any);

    if (setErrors && zodErrors) setErrors(zodErrors);
    return zodErrors;
  }
}
