import React from 'react';
import { Navigation } from 'react-native-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '@/screens/App';
import { screenName as getScreenName } from '@/util/navigation';

const screens = {
    App,
};

const WrappedComponent = (ScreenComponent: React.ComponentType<any>) => {
    return (props: any) => {
        return (
            <SafeAreaProvider>
                <ScreenComponent {...props} />
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
