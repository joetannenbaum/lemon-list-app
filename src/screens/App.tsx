import React, { useEffect, useState } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import { ActivityIndicator } from 'react-native';
import { getAccessTokenFromKeychain } from '@/util/keychain';
import { setStackRootWithoutAnimating } from '@/util/navigation';
import useShoppingLists from '@/hooks/useShoppingLists';

interface Props extends ScreenProps {}

const App: Screen<Props> = (props) => {
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const lists = useShoppingLists(hasToken === true);

    useEffect(() => {
        getAccessTokenFromKeychain().then((token) => {
            setHasToken(token !== false);
        });
    }, []);

    useEffect(() => {
        if (hasToken === false) {
            return setStackRootWithoutAnimating('Login');
        }

        if (lists.isFetched) {
            return setStackRootWithoutAnimating('ShoppingList', {
                id: lists.data[0].id,
            });
        }
    }, [hasToken, lists]);

    return <ActivityIndicator />;
};

export default App;
