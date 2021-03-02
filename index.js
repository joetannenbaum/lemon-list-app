import './wdyr';
import 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from '@/screens';
import { screenComponent, mainStackId } from '@/util/navigation';
import Bugsnag from '@bugsnag/react-native';

Bugsnag.start();

registerScreens();

Navigation.setDefaultOptions({
    topBar: {
        visible: false,
    },
});

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                id: mainStackId,
                children: [screenComponent('App')],
            },
        },
    });
});
