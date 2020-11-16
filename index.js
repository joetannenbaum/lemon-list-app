import { Navigation } from 'react-native-navigation';
import { registerScreens } from '@/screens';
import { screenComponent } from '@/util/navigation';
import Bugsnag from '@bugsnag/react-native';

Bugsnag.start();

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [screenComponent('App')],
            },
        },
    });
});
