import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { showAlert } from './functions/enqueueAlert'; // Assuming you have a custom alert function
import { appI18next } from '../i18n'; // Assuming you are using i18n for internationalization

const commonBaseQuery = async (args: any, api: any, extraOptions: any) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: 'http://localhost:50450/api/', // Base URL for all requests
        prepareHeaders: (headers) => {
            const serviceToken = window.localStorage.getItem('serviceToken');
            if (serviceToken) {
                headers.set('Authorization', `Bearer ${serviceToken}`);
            }
            headers.set('Cache-Control', 'no-cache');
            headers.set('Pragma', 'no-cache');
            headers.set('If-None-Match', '');
            return headers;
        }
    });

    // Execute the request
    const result = await baseQuery(args, api, extraOptions);

    // Handle errors
    if (result.error) {
        const { status, data } = result.error;

        // Check error status and show relevant alert
        if (!status) {
            showAlert.warning(appI18next.t('statusCodes.network')); // Network issue
        } else if (status === 400) {
            showAlert.warning(appI18next.t('statusCodes.400')); // Bad Request
        } else if (status === 404) {
            showAlert.warning(appI18next.t('statusCodes.404')); // Not Found
        } else if (status === 500) {
            showAlert.warning(appI18next.t('statusCodes.500')); // Internal Server Error
        } else {
            showAlert.error(appI18next.t('statusCodes.code', { status, message: data || 'Unknown error' })); // Other errors
        }
    }

    return result;
};

export { commonBaseQuery };

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { showAlert } from './functions/enqueueAlert';
// import { appI18next } from '../i18n';
// import { OptionsObject } from 'notistack';

// const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
//     const baseQuery = fetchBaseQuery({
//         baseUrl: 'http://localhost:50450/api/', // Your base URL here
//         prepareHeaders: (headers) => {
//             const serviceToken = window.localStorage.getItem('serviceToken');
//             if (serviceToken) {
//                 headers.set('Authorization', `Bearer ${serviceToken}`);
//             }
//             headers.set('Cache-Control', 'no-cache');
//             headers.set('Pragma', 'no-cache');
//             headers.set('If-None-Match', ''); // Clear ETag
//             return headers;
//         }
//     });

//     const result = await baseQuery(args, api, extraOptions);

//     if (result.error) {
//         const { status, data } = result.error;
//         if (!status) {
//             showAlert.warning(appI18next.t('statusCodes.network'));
//         } else if (status === 400) {
//             showAlert.warning(appI18next.t('statusCodes.400'));
//         } else if (status === 404) {
//             showAlert.warning(appI18next.t('statusCodes.404'));
//         } else if (status === 500) {
//             showAlert.warning(appI18next.t('statusCodes.500'));
//         } else {
//             showAlert.error(appI18next.t('statusCodes.code', { status, message: data || 'Unknown error' }));
//         }
//     }

//     return result;
// };

// export const baseApi = createApi({
//     reducerPath: '', // Common reducer path
//     baseQuery: customBaseQuery,
//     endpoints: () => ({})
// });
