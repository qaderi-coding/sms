import { enqueueSnackbar, OptionsObject } from 'notistack';

export function enqueueAlert(message?: string, options?: OptionsObject) {
    let defaultOptions = {
        variant: 'alertDialog',
        persist: true,
        hideIconVariant: false,
        anchorOrigin: { horizontal: 'right', vertical: 'top' },
        ...options
    } as OptionsObject;
    enqueueSnackbar(message, options);
}

export function enqueueInfo(message?: string, options?: OptionsObject) {
    if (message) enqueueAlert(message, { variant: 'info', ...options });
}

export function enqueueServerError(message?: string, options?: OptionsObject) {
    if (message) enqueueAlert(message, { variant: 'serverErrorDialog', persist: true, ...options });
}

export function enqueueSuccess(message?: string, options?: OptionsObject) {
    if (message) enqueueAlert(message, { variant: 'success', ...options });
}

export function enqueueWarning(message?: string, options?: OptionsObject) {
    if (message) enqueueAlert(message, { variant: 'warning', ...options });
}

export function enqueueError(message?: string, options?: OptionsObject) {
    if (message) enqueueAlert(message, { variant: 'error', ...options });
}

export const showAlert = {
    default: enqueueAlert,
    info: enqueueInfo,
    success: enqueueSuccess,
    warning: enqueueWarning,
    error: enqueueError,
    serverError: enqueueServerError
};
