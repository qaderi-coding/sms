import { AxiosResponse } from 'axios';
import appAxios from 'utils/axios';

export const apiUrl = process.env.REACT_APP_API_URL;
// export const appendUrl = (url: string) => (url.startsWith('/') ? `${apiUrl}${url}` : `${apiUrl}/${url}`);
export const getResponseJson = <T>(response: AxiosResponse<T, any>) => response.data as T;

export const requestApi = {
    get: async <T>(url: string, config: any = {}): Promise<T> => {
        return appAxios.get<T>(url, config).then(getResponseJson<T>);
    },
    post: async <T>(url: string, data: any = {}, config: any = {}): Promise<T> => {
        return appAxios.post<T>(url, data, config).then(getResponseJson<T>);
    },
    patch: async <T>(url: string, data: any = {}): Promise<T> => {
        return appAxios.patch<T>(url, data).then(getResponseJson<T>);
    },
    put: async <T>(url: string, data: any = {}, config: any = {}): Promise<T> => {
        return appAxios.put<T>(url, data, config).then(getResponseJson<T>);
    },
    delete: async <T>(url: string, config: any = {}): Promise<T> => {
        return appAxios.delete<T>(url, config).then(getResponseJson<T>);
    },
    postDownloadFile: async <T>(url: string, data: object, config: any = {}): Promise<T> => {
        return appAxios.post<T>(url, data, config).then(getResponseJson<T>);
    }
};

