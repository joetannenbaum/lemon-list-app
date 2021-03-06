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
import EditIncomingShareItem from '@/screens/EditIncomingShareItem';
import EditShoppingList from '@/screens/EditShoppingList';
import EditShoppingListItem from '@/screens/EditShoppingListItem';
import EditStore from '@/screens/EditStore';
import IncomingShare from '@/screens/IncomingShare';
import IncomingShareImportList from '@/screens/IncomingShareImportList';
import ListenForIncomingShare from '@/screens/ListenForIncomingShare';
import Login from '@/screens/Login';
import Menu from '@/screens/Menu';
import Register from '@/screens/Register';
import ShareShoppingList from '@/screens/ShareShoppingList';
import ShoppingList from '@/screens/ShoppingList';
import ShoppingListStoreSelect from '@/screens/ShoppingListStoreSelect';
import Store from '@/screens/Store';
import Welcome from '@/screens/Welcome';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import AsyncStoragePersistor from '@/util/AsyncStoragePersistor';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: Infinity,
            // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

persistQueryClient({
    queryClient,
    persistor: AsyncStoragePersistor,
});

const screens = {
    AcceptShare,
    AddItemsFromListsStart,
    App,
    EditIncomingShareItem,
    EditShoppingList,
    EditShoppingListItem,
    EditStore,
    IncomingShare,
    IncomingShareImportList,
    ListenForIncomingShare,
    Login,
    Menu,
    Register,
    ShareShoppingList,
    ShoppingList,
    ShoppingListStoreSelect,
    Store,
    Welcome,
};

const SafeareaWrappedComponent = (
    ScreenComponent: React.ComponentType<any>,
) => {
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

const WrappedComponent = (ScreenComponent: React.ComponentType<any>) => {
    return (props: any) => {
        return (
            <QueryClientProvider client={queryClient}>
                <ScreenComponent {...props} />
            </QueryClientProvider>
        );
    };
};

export type screenComponentName =
    | 'AcceptShare'
    | 'AddItemsFromListsStart'
    | 'App'
    | 'EditIncomingShareItem'
    | 'EditShoppingList'
    | 'EditShoppingListItem'
    | 'EditStore'
    | 'IncomingShare'
    | 'IncomingShareImportList'
    | 'ListenForIncomingShare'
    | 'Login'
    | 'Register'
    | 'ShareShoppingList'
    | 'ShoppingList'
    | 'ShoppingListStoreSelect'
    | 'Store'
    | 'Welcome';

const enhance = flowRight(gestureHandlerRootHOC, SafeareaWrappedComponent);
const enhanceOverlay = flowRight(WrappedComponent);

export const registerScreens = () => {
    for (const screenName in screens) {
        Navigation.registerComponent(getScreenName(screenName), () =>
            hoistNonReactStatics(
                screenName === 'ListenForIncomingShare'
                    ? enhanceOverlay(screens[screenName])
                    : enhance(screens[screenName]),
                screens[screenName],
            ),
        );
    }
};
