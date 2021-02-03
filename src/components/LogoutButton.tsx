import React from 'react';
import { Button } from 'react-native';
import { clearAllTokensFromKeychain } from '@/util/keychain';
import { setStackRootWithoutAnimating } from '@/util/navigation';
import { useQueryClient } from 'react-query';

interface Props {}

const LogoutButton: React.FC<Props> = (props) => {
    const queryClient = useQueryClient();

    const onPress = () => {
        clearAllTokensFromKeychain().then(() => {
            queryClient.clear();
            setStackRootWithoutAnimating('App');
        });
    };

    return <Button title="Logout" onPress={onPress} />;
};

export default LogoutButton;
