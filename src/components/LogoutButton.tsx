import React, { useCallback } from 'react';
import { Button } from 'react-native';
import { clearAllTokensFromKeychain } from '@/util/keychain';
import { setStackRootWithoutAnimating } from '@/util/navigation';
import { useQueryClient } from 'react-query';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BaseText from './BaseText';

interface Props {}

const LogoutButton: React.FC<Props> = (props) => {
    const queryClient = useQueryClient();

    const onPress = useCallback(() => {
        clearAllTokensFromKeychain().then(() => {
            queryClient.clear();
            setStackRootWithoutAnimating('App');
        });
    }, []);

    return (
        <TouchableOpacity onPress={onPress}>
            <BaseText>Logout</BaseText>
        </TouchableOpacity>
    );
};

export default LogoutButton;
