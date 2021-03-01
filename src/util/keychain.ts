import * as Keychain from 'react-native-keychain';
import { getBundleId } from 'react-native-device-info';

const getOptions = (suffix: string): Keychain.Options => {
    const bundleId = getBundleId();

    return {
        service: [bundleId, suffix]
            .filter((segment) => segment !== null)
            .join('.'),
    };
};

const saveInKeychain = (
    service: string,
    value: string,
): Promise<false | Keychain.Result> =>
    Keychain.setGenericPassword(
        // Should we make this specific from app-to-app? Or better that we have universal login here?
        'LemonListUser',
        value,
        getOptions(service),
    );

const getFromKeychain = (service: string): Promise<false | string> =>
    Keychain.getGenericPassword(getOptions(service)).then((res) =>
        res ? res.password : false,
    );

const clearFromKeyChain = (service: string) =>
    Keychain.resetGenericPassword(getOptions(service));

export const saveAccessTokenInKeychain = (token: string) =>
    saveInKeychain('accessToken', token);
export const saveRefreshTokenInKeychain = (token: string) =>
    saveInKeychain('refreshToken', token);

export const getAccessTokenFromKeychain = () => getFromKeychain('accessToken');
export const getRefreshTokenFromKeychain = () =>
    getFromKeychain('refreshToken');

export const clearAllTokensFromKeychain = () =>
    Promise.all([
        clearFromKeyChain('accessToken'),
        clearFromKeyChain('refreshToken'),
    ]);
