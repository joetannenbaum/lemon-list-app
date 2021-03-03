import React from 'react';
import { Navigation } from 'react-native-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { screenName as getScreenName } from '@/util/navigation';
import { QueryClient, QueryClientProvider } from 'react-query';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import flowRight from 'lodash/flowRight';
import AcceptShare from '@/screens/AcceptShare';
import AddItemsFromListsStart from '@/screens/AddItemsFromListsStart';
import App from '@/screens/App';
import EditShoppingList from '@/screens/EditShoppingList';
import EditShoppingListItem from '@/screens/EditShoppingListItem';
import EditStore from '@/screens/EditStore';
import IncomingShare from '@/screens/IncomingShare';
import Login from '@/screens/Login';
import Menu from '@/screens/Menu';
import Register from '@/screens/Register';
import ShareShoppingList from '@/screens/ShareShoppingList';
import ShoppingList from '@/screens/ShoppingList';
import ShoppingListStoreSelect from '@/screens/ShoppingListStoreSelect';
import Store from '@/screens/Store';

const queryClient = new QueryClient();

const screens = {
    AcceptShare,
    AddItemsFromListsStart,
    App,
    EditShoppingList,
    EditShoppingListItem,
    EditStore,
    IncomingShare,
    Login,
    Menu,
    Register,
    ShareShoppingList,
    ShoppingList,
    ShoppingListStoreSelect,
    Store,
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
    | 'App'
    | 'EditShoppingList'
    | 'EditShoppingListItem'
    | 'EditStore'
    | 'IncomingShare'
    | 'Login'
    | 'Register'
    | 'ShareShoppingList'
    | 'ShoppingList'
    | 'ShoppingListStoreSelect'
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
