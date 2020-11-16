import Axios from 'axios';
import Config from 'react-native-config';
import {
    saveAccessTokenInKeychain,
    saveRefreshTokenInKeychain,
} from '@/util/keychain';

export const requestAccessToken = (email: string, password: string) => {
    return Axios.post(`${Config.API_URL}/oauth/token`, {
        grant_type: 'password',
        client_id: Config.OAUTH_CLIENT_ID,
        client_secret: Config.OAUTH_CLIENT_SECRET,
        username: email,
        password: password,
        scope: '*', // TODO: More specific scope
    }).then((res) => {
        saveAccessTokenInKeychain(res.data.access_token);
        saveRefreshTokenInKeychain(res.data.refresh_token);
    });
};
