import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import logger from '@/util/logger';
import Config from 'react-native-config';
import breadcrumb from '@/bugsnag/breadcrumb';
import { Platform } from 'react-native';
import { getBundleId, getVersion } from 'react-native-device-info';
import { useAccountInterceptors } from './interceptors';
import Bugsnag from '@bugsnag/react-native';

const params: AxiosRequestConfig = {
    baseURL: `${Config.API_URL}/api`,
    responseType: 'json',
    headers: {
        'APP-VERSION': getVersion(),
        'APP-IDENTIFIER': getBundleId(),
        'APP-PLATFORM': Platform.OS,
    },
};

if (Config.API_BASIC_AUTH_USERNAME && Config.API_BASIC_AUTH_PASSWORD) {
    params.auth = {
        username: Config.API_BASIC_AUTH_USERNAME,
        password: Config.API_BASIC_AUTH_PASSWORD,
    };
}

const instance = axios.create(params);

useAccountInterceptors(instance);

if (__DEV__) {
    instance.interceptors.request.use((config) => {
        logger.yellow(
            `${config?.method?.toUpperCase()} ${config.url}?${Object.entries(
                config.params || {},
            )
                .map(([key, val]) => `${key}=${val}`)
                .join('&')}`,
        );

        return config;
    });
}

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        logger.red(error.toString());

        if (error.response) {
            if (error.response.config) {
                breadcrumb.log('API Config', error.response.config);
                breadcrumb.log('URL', error.response.config.url);

                logger.red(`Method: ${error.response.config.method}`);
                logger.red(error.response.config.url);
                logger.red(JSON.stringify(error.response.config.params));
            }

            if (error.response.data) {
                const data = JSON.stringify(error.response.data);

                logger.red(data);
                Bugsnag.notify(data);
            }
        }

        // if (error.toString() === 'Error: Network Error') {
        // store.dispatch(setOffline(true));
        // }

        return Promise.reject(error);
    },
);

// axiosRetry(instance, {
//     retries: 3,
//     retryDelay: (retryCount) => retryCount * 1000,
//     retryCondition: (error) => {
//         return isNetworkOrIdempotentRequestError(error);
//     },
// });

export default instance;
