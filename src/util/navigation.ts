import {
    Options,
    Navigation,
    LayoutComponent,
    Layout,
} from 'react-native-navigation';
import { screenComponentName } from '@/screens';

export const mainStackId = 'MainGroceryListStack';
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

export const setStackRootWithoutAnimating = (name: string) => {
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
        }),
    );
};
