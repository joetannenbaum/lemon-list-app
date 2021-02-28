import { FunctionComponent } from 'react';
import { Options } from 'react-native-navigation';
import { asModalProps, asModalExportedProps } from '@/components/asModal';

export interface ScreenProps {
    componentId: string;
}

export interface Screen<T extends ScreenProps> extends FunctionComponent<T> {
    options?: Options;
}

export type ModalScreenProps = ScreenProps &
    asModalExportedProps &
    asModalProps;
