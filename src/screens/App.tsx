import React, { useEffect, useState } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import { ActivityIndicator } from 'react-native';
import { getAccessTokenFromKeychain } from '@/util/keychain';
import {
    setStackRootWithoutAnimating,
    screenComponent,
} from '@/util/navigation';
import useShoppingLists from '@/hooks/useShoppingLists';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lastShoppingListViewedKey } from '@/util/storage';

interface Props extends ScreenProps {}

const App: Screen<Props> = (props) => {
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const lists = useShoppingLists(hasToken === true);

    useEffect(() => {
        Navigation.showOverlay(screenComponent('ListenForIncomingShare'));
    }, []);

    useEffect(() => {
        getAccessTokenFromKeychain().then((token) => {
            setHasToken(token !== false);
        });
    }, []);

    useEffect(() => {
        if (hasToken === false) {
            setStackRootWithoutAnimating('Login');
            return;
        }

        if (lists.isFetched) {
            AsyncStorage.getItem(lastShoppingListViewedKey).then((val) => {
                const id = parseInt(val, 10);

                const listId = lists.data?.find((list) => list.id === id)
                    ? id
                    : lists.data[0].id;

                setStackRootWithoutAnimating('ShoppingList', {
                    // TODO: What if they have no lists
                    id: listId,
                });
            });
        }
    }, [hasToken, lists]);

    return <ActivityIndicator />;
};

export default App;
