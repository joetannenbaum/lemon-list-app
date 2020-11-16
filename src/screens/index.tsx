import React from 'react';
import { Navigation } from 'react-native-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '@/screens/App';
import Register from '@/screens/Register';
import Login from '@/screens/Login';
import Home from '@/screens/Home';
import { screenName as getScreenName } from '@/util/navigation';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

const queryCache = new QueryCache();

const screens = {
    App,
    Register,
    Login,
    Home,
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

export const registerScreens = () => {
    for (const screenName in screens) {
        Navigation.registerComponent(getScreenName(screenName), () =>
            hoistNonReactStatics(
                WrappedComponent(screens[screenName]),
                screens[screenName],
            ),
        );
    }
};
