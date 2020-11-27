import { FunctionComponent } from 'react';
import { Options } from 'react-native-navigation';

export interface ScreenProps {
    componentId: string;
}

export interface Screen<T extends ScreenProps> extends FunctionComponent<T> {
    options?: Options;
}
