import React from 'react';
import { Button } from 'react-native';
import { clearAllTokensFromKeychain } from '@/util/keychain';
import { setStackRootWithoutAnimating } from '@/util/navigation';
import { useQueryCache } from 'react-query';

interface Props {}

const LogoutButton: React.FC<Props> = (props) => {
    const queryCache = useQueryCache();

    const onPress = () => {
        clearAllTokensFromKeychain().then(() => {
            queryCache.clear();
            setStackRootWithoutAnimating('App');
        });
    };

    return <Button title="Logout" onPress={onPress} />;
};

export default LogoutButton;
