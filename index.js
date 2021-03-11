import './wdyr';
import 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from '@/screens';
import { screenComponent, mainStackId } from '@/util/navigation';
import Bugsnag from '@bugsnag/react-native';
import { yellow200, yellow100 } from '@/util/style';

Bugsnag.start();

registerScreens();

Navigation.setDefaultOptions({
    topBar: {
        visible: false,
    },
    statusBar: {
        backgroundColor: yellow200,
        style: 'dark',
    },
    layout: {
        backgroundColor: '#fff',
        componentBackgroundColor: '#fff',
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
