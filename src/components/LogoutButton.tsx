import React from 'react';
import { Button } from 'react-native';
import { clearAllTokensFromKeychain } from '@/util/keychain';
import { setStackRootWithoutAnimating } from '@/util/navigation';

interface Props {}

const LogoutButton: React.FC<Props> = (props) => {
    const onPress = () => {
        clearAllTokensFromKeychain().then(() => {
            setStackRootWithoutAnimating('App');
        });
    };

    return <Button title="Logout" onPress={onPress} />;
};

export default LogoutButton;
