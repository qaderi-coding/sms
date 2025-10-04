import axios from 'axios';
import { showAlert } from './functions/enqueueAlert';
import { OptionsObject } from 'notistack';

// ✅ Use Vite env variables instead of process.env
const baseURL = import.meta.env.MODE === 'production' ? import.meta.env.VITE_PUBLIC_API_URL : import.meta.env.VITE_LOCAL_API_URL;

const axiosServices = axios.create({ baseURL });

// Response interceptor for handling errors
axiosServices.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (!error.response) {
      // showAlert.warning(appI18next.t("statusCodes.network"));
      return Promise.reject(error);
    }

    const { status, config, data } = error.response;

    switch (status) {
      case 400:
        if (import.meta.env.MODE === 'production') {
          // showAlert.serverError(appI18next.t("statusCodes.400"));
        } else {
          // showAlert.default(appI18next.t("statusCodes.400"), {
          //   variant: "alertDialog",
          //   persist: true,
          //   response: data,
          //   request: config.data,
          //   status: status,
          // } as OptionsObject<"alertDialog">);
        }
        break;

      case 401:
        // showAlert.warning(appI18next.t("statusCodes.401"));
        break;

      case 404:
        // showAlert.warning(appI18next.t("statusCodes.404"));
        break;

      case 500:
        if (import.meta.env.MODE === 'production') {
          // showAlert.error(appI18next.t("statusCodes.500"));
        } else {
          // showAlert.default(appI18next.t("statusCodes.500"), {
          //   variant: "alertDialog",
          //   persist: true,
          //   response: data,
          //   request: config.data,
          //   status: status,
          // } as OptionsObject<"alertDialog">);
        }
        break;

      default:
        showAlert.error(
          // appI18next.t("statusCodes.code", {
          //   status,
          //   message: error.message,
          // })
          `Error ${status}: ${error.message}`
        );
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosServices;
