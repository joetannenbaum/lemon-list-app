import {
    Options,
    Navigation,
    LayoutComponent,
    Layout,
} from 'react-native-navigation';
import { screenComponentName } from '@/screens';
import Url from 'url-parse';
import createMatcher from 'feather-route-matcher';
import { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { AcceptShareProps } from '@/screens/AcceptShare';
import { RNNDrawer } from 'react-native-navigation-drawer-extension';

export const mainStackId = 'MainLemonListStack';
export const screenPrefix = 'groceryList';

export const screenName = (name: string) => `${screenPrefix}.${name}`;

export const screenComponent = <P = {}>(
    name: screenComponentName,
    params: { options?: Options; passProps?: P } = {},
): Layout<LayoutComponent<P>> => ({
    component: {
        name: screenName(name),
        ...params,
    },
});

export const setStackRootWithoutAnimating = (
    name: screenComponentName,
    passProps = {},
) => {
    Navigation.setStackRoot(
        mainStackId,
        screenComponent(name, {
            options: {
                animations: {
                    setStackRoot: {
                        enabled: false,
                    },
                },
            },
            passProps,
        }),
    );
};

const matcher = createMatcher({
    '/list/:uuid': 'share-list',
});

export const handleDynamicLink = (
    link: FirebaseDynamicLinksTypes.DynamicLink | null,
) => {
    if (!link?.url) {
        return;
    }

    const url = new Url(link.url);
    const route = matcher(url.pathname);

    if (route.value === 'share-list') {
        Navigation.showModal(
            screenComponent<AcceptShareProps>('AcceptShare', {
                passProps: {
                    listUuid: route.params.uuid,
                },
            }),
        );
    }
};

export const showMenu = () => {
    RNNDrawer.showDrawer({
        component: {
            name: 'Menu',
            passProps: {
                animationOpenTime: 300,
                animationCloseTime: 300,
                direction: 'left',
                dismissWhenTouchOutside: true,
                fadeOpacity: 0.6,
                drawerScreenWidth: '75%',
                drawerScreenHeight: '100%',
            },
        },
    });
};

export const hideMenu = () => {
    RNNDrawer.dismissDrawer();
};

export const showPopup = (name: screenComponentName, passProps = {}) => {
    Navigation.showOverlay(
        screenComponent(name, {
            passProps,
            options: {
                layout: {
                    componentBackgroundColor: 'transparent',
                },
                overlay: {
                    handleKeyboardEvents: true,
                },
            },
        }),
    );
};
