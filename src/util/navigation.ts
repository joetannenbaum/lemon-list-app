import { Options, Navigation } from 'react-native-navigation';

export const mainStackId = 'MainGroceryListStack';
export const screenPrefix = 'groceryList';

export const screenName = (name: string) => `${screenPrefix}.${name}`;

export const screenComponent = (
    name: string,
    params: { options?: Options; passProps?: object } = {},
) => ({
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
