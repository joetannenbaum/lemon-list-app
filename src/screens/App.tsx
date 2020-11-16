import React, { useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import { ActivityIndicator } from 'react-native';
import { getAccessTokenFromKeychain } from '@/util/keychain';
import { setStackRootWithoutAnimating } from '@/util/navigation';

interface Props extends ScreenProps {}

const App: Screen<Props> = (props) => {
    useEffect(() => {
        getAccessTokenFromKeychain().then((token) => {
            if (token) {
                return setStackRootWithoutAnimating('Home');
            }

            return setStackRootWithoutAnimating('Login');
        });
    }, []);

    return <ActivityIndicator />;
};

export default App;
