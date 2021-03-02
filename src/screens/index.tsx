import React from 'react';
import { Navigation } from 'react-native-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { screenName as getScreenName } from '@/util/navigation';
import { QueryClient, QueryClientProvider } from 'react-query';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import flowRight from 'lodash/flowRight';
import AcceptShare from '@/screens/AcceptShare';
import App from '@/screens/App';
import EditShoppingList from '@/screens/EditShoppingList';
import IncomingShare from '@/screens/IncomingShare';
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import ShoppingList from '@/screens/ShoppingList';
import Store from '@/screens/Store';
import ShareShoppingList from '@/screens/ShareShoppingList';
import AddItemsFromListsStart from '@/screens/AddItemsFromListsStart';
import ShoppingListStoreSelect from '@/screens/ShoppingListStoreSelect';
import EditShoppingListItem from '@/screens/EditShoppingListItem';
import Menu from '@/screens/Menu';

const queryClient = new QueryClient();

const screens = {
    AcceptShare,
    App,
    EditShoppingList,
    Menu,
    IncomingShare,
    Login,
    Register,
    ShoppingList,
    Store,
    ShareShoppingList,
    AddItemsFromListsStart,
    ShoppingListStoreSelect,
    EditShoppingListItem,
};

const WrappedComponent = (ScreenComponent: React.ComponentType<any>) => {
    return (props: any) => {
        return (
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <ScreenComponent {...props} />
                </QueryClientProvider>
            </SafeAreaProvider>
        );
    };
};

export type screenComponentName =
    | 'AcceptShare'
    | 'AddItemsFromListsStart'
    | 'ShareShoppingList'
    | 'App'
    | 'EditShoppingList'
    | 'IncomingShare'
    | 'Login'
    | 'Register'
    | 'ShoppingListStoreSelect'
    | 'ShoppingList'
    | 'EditShoppingListItem'
    | 'Store';

const enhance = flowRight(gestureHandlerRootHOC, WrappedComponent);

export const registerScreens = () => {
    for (const screenName in screens) {
        Navigation.registerComponent(getScreenName(screenName), () =>
            hoistNonReactStatics(
                enhance(screens[screenName]),
                screens[screenName],
            ),
        );
    }
};
