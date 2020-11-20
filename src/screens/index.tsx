import React from 'react';
import { Navigation } from 'react-native-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '@/screens/App';
import EditShoppingListItem from '@/screens/EditShoppingListItem';
import Home from '@/screens/Home';
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import ShoppingList from '@/screens/ShoppingList';
import Store from '@/screens/Store';
import { screenName as getScreenName } from '@/util/navigation';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const queryCache = new QueryCache();

const screens = {
    App,
    EditShoppingListItem,
    Home,
    Login,
    Register,
    ShoppingList,
    Store,
};

const WrappedComponent = (ScreenComponent: React.ComponentType<any>) => {
    return (props: any) => {
        return (
            <SafeAreaProvider>
                <ReactQueryCacheProvider queryCache={queryCache}>
                    <ScreenComponent {...props} />
                </ReactQueryCacheProvider>
            </SafeAreaProvider>
        );
    };
};

export type screenComponentName =
    | 'App'
    | 'Home'
    | 'Login'
    | 'Register'
    | 'ShoppingList'
    | 'Store'
    | 'EditShoppingListItem';

export const registerScreens = () => {
    for (const screenName in screens) {
        Navigation.registerComponent(getScreenName(screenName), () =>
            hoistNonReactStatics(
                gestureHandlerRootHOC(WrappedComponent(screens[screenName])),
                screens[screenName],
            ),
        );
    }
};
