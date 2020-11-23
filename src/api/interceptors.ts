import {
    getAccessTokenFromKeychain,
    getRefreshTokenFromKeychain,
    saveRefreshTokenInKeychain,
    saveAccessTokenInKeychain,
} from '@/util/keychain';
import Axios, { AxiosInstance, AxiosError } from 'axios';
import logger from '@/util/logger';
import Config from 'react-native-config';

// TODO: Make JWT refresh actually work
const accessTokenExpired = (error: AxiosError) =>
    error?.response?.status === 401 &&
    error?.response?.data?.message ===
        'Your session expired, please log in again.';

const accessTokenNotFound = (error: AxiosError) =>
    error?.response?.status === 401 &&
    error?.response?.data?.message === 'JWT Token not found';

export const useAccountInterceptors = (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use((config) => {
        return getAccessTokenFromKeychain().then((token) => {
            if (!token) {
                return Promise.resolve(config);
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return Promise.resolve(config);
        });
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (accessTokenExpired(error)) {
                console.log('TOKEN EXPIRED!!!');

                return getRefreshTokenFromKeychain()
                    .then((refreshToken) =>
                        // TODO: Replace with real token refresh!
                        Axios.get(
                            `${Config.API_URL}/jwt-refresh/${refreshToken}`,
                        ),
                    )
                    .then((response) => {
                        return Promise.all([
                            saveAccessTokenInKeychain(response.data.token),
                            saveRefreshTokenInKeychain(
                                response.data.refreshToken,
                            ),
                        ]);
                    })
                    .then(() => axiosInstance.request(error.config))
                    .catch((refreshError) => {
                        logger.red(refreshError.toString());
                        // They haven't used the app in a very long time, alert them to re-login
                        logger.red('MUST RE-LOGIN, REFRESH TOKEN EXPIRED');
                    });
            }

            if (accessTokenNotFound(error)) {
                console.log('ACCESS TOKEN NOT FOUND!!!');
            }

            return Promise.reject(error);
        },
    );
};
