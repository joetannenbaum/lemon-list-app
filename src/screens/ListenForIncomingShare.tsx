import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import useListenForIncomingShare from '@/hooks/useListenForIncomingShare';

export interface ListenForIncomingShareProps {}

const ListenForIncomingShare: Screen<
    ListenForIncomingShareProps & ScreenProps
> = (props) => {
    useListenForIncomingShare();

    return null;
};

ListenForIncomingShare.options = {
    layout: {
        componentBackgroundColor: 'transparent',
    },
    overlay: {
        interceptTouchOutside: false,
    },
};

export default ListenForIncomingShare;
