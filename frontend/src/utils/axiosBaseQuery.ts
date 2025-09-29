import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axiosRTKInstance from './axiosRTK';

const axiosBaseQuery =
    (
        { baseUrl }: { baseUrl: string } = { baseUrl: '' }
    ): BaseQueryFn<
        {
            url: string;
            method: string;
            data?: any;
            params?: any;
        },
        unknown,
        unknown
    > =>
    async ({ url, method, data, params }) => {
        try {
            const result = await axiosRTKInstance({
                url: baseUrl + url,
                method,
                data,
                params
            });
            return { data: result.data };
        } catch (axiosError: any) {
            const err = axiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message
                }
            };
        }
    };

export default axiosBaseQuery;
