import { FunctionComponent } from 'react';

export interface ScreenProps {
    componentId: string;
}

export interface Screen<T extends ScreenProps> extends FunctionComponent<T> {
    options?: Options;
}
