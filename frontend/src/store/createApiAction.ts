import { handleServerValidations } from '../utils/functions/handleServerValidations';
import { FormikErrors } from 'formik';
import { useDispatch } from 'react-redux';
import { showAlert } from 'utils/functions/enqueueAlert';

export type ApiActionResponse<T> = {
  success: boolean;
  data: T;
};

export function createApiAction<TEntity>(
  apiRequest: Promise<TEntity>,
  action?: (entity: TEntity) => any,
  setErrors?: (errors: FormikErrors<TEntity>) => void,
  loadingAction?: (state: boolean) => any
) {
  return async (dispatch: any) => {
    if (loadingAction) dispatch(loadingAction(true));
    return await apiRequest
      .then((entities) => {
        if (action) dispatch(action(entities));
        return {
          success: true,
          data: entities
        } as ApiActionResponse<TEntity>;
      })
      .catch((error) => {
        let errors = handleServerValidations(error, setErrors);
        return {
          success: false,
          data: errors
        } as ApiActionResponse<TEntity>;
      })
      .finally(() => {
        if (loadingAction) dispatch(loadingAction(false));
      });
  };
}

export function createApiGetAction<TEntity>(
  apiRequest: Promise<TEntity>,
  action: (entity: TEntity) => any,
  setErrors?: (errors: FormikErrors<TEntity>) => void,
  loadingAction?: (state: boolean) => any
) {
  return request<TEntity>(apiRequest, action, setErrors, loadingAction);
}

export function createApiDeleteAction<TEntity>(
  apiRequest: Promise<TEntity>,
  action: (entity: TEntity) => any,
  setErrors?: (errors: FormikErrors<TEntity>) => void,
  loadingAction?: (state: boolean) => any
) {
  return request<TEntity>(apiRequest, action, setErrors, loadingAction);
}

export function request<TEntity>(
  apiRequest: Promise<TEntity>,
  action?: (entity: TEntity) => any,
  setErrors?: (errors: FormikErrors<TEntity>) => void,
  loadingAction?: (state: boolean) => any
) {
  return async (dispatch: any) => {
    if (loadingAction) dispatch(loadingAction(true));
    return await apiRequest
      .then((entities) => {
        if (action) dispatch(action(entities));
        if (entities === null || entities === '' || entities === undefined) {
          return true;
        }
        return entities;
      })
      .catch((error) => {
        handleServerValidations(error, setErrors);
        return false;
      })
      .finally(() => {
        if (loadingAction) dispatch(loadingAction(false));
      });
  };
}

export function createApiPostAction<TEntity>(
  apiRequest: Promise<TEntity>,
  action?: (entity: TEntity) => any,
  setErrors?: (errors: FormikErrors<TEntity>) => void,
  loadingAction?: (state: boolean) => any
) {
  return async (dispatch: any) => {
    if (loadingAction) dispatch(loadingAction(true));
    return await apiRequest
      .then((entities) => {
        showAlert.success('statusCodes.200');

        if (action) dispatch(action(entities));
        if (entities === null || entities === '' || entities === undefined) {
          return true;
        }
        return entities;
      })
      .catch((error) => {
        console.log(error, 'error');
        handleServerValidations(error, setErrors);
        return false;
      })
      .finally(() => {
        if (loadingAction) dispatch(loadingAction(false));
      });
  };
}

export function dispatchLoadingAction(loadingAction: (state: boolean) => any, status: boolean) {
  return async (dispatch: any) => {
    dispatch(loadingAction(status));
  };
}
