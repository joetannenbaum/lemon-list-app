import React, { useEffect } from 'react';
import {
    NativeModules,
    Platform,
    Linking,
    AppState,
    AppStateStatus,
} from 'react-native';
import {
    Navigation,
    OptionsModalPresentationStyle,
} from 'react-native-navigation';
import { screenComponent } from '@/util/navigation';
import { IncomingShareProps } from '@/screens/IncomingShare';
import MimeTypes from '@/util/mimeTypes';

const { ReceiveSharingIntent } = NativeModules;

interface IncomingShare {
    filePath: string | null;
    text: string | null;
    weblink: string | null;
    mimeType: string | null;
    contentUri: string | null;
    fileName: string | null;
    extension: string | null;
}

const iosSortedData = (file: string) => {
    const defaultObject = {
        filePath: null,
        text: null,
        weblink: null,
        mimeType: null,
        contentUri: null,
        fileName: null,
        extension: null,
    };

    if (file.startsWith('text:')) {
        const text = file.replace('text:', '');

        if (text.startsWith('http')) {
            return [{ ...defaultObject, weblink: text }];
        }

        return [{ ...defaultObject, text: text }];
    }

    if (file.startsWith('webUrl:')) {
        return [{ ...defaultObject, weblink: file.replace('webUrl:', '') }];
    }

    try {
        return JSON.parse(file).map((file) => ({
            ...defaultObject,
            fileName: getFileName(file.path),
            extension: getExtension(file.path),
            mimeType: getMimeType(file.path),
            filePath: file.path,
        }));
    } catch (error) {
        return [defaultObject];
    }
};

const getFileName = (file: string) => file.replace(/^.*(\\|\/|\:)/, '');

const getExtension = (fileName: string) =>
    fileName.substr(fileName.lastIndexOf('.') + 1);

const getMimeType = (file: string) => {
    const extension = '.' + getExtension(file).toLowerCase();

    return MimeTypes[extension] || null;
};

export default () => {
    const showModal = (files: IncomingShare[]) => {
        if (files.length === 0) {
            return;
        }

        Navigation.showModal(
            screenComponent<IncomingShareProps>('IncomingShare', {
                passProps: {
                    text: files[0].text,
                    url: files[0].weblink,
                },
                options: {
                    modalPresentationStyle:
                        OptionsModalPresentationStyle.fullScreen,
                    modal: {
                        swipeToDismiss: false,
                    },
                },
            }),
        );
    };

    const getFileNames = (url?: string) => {
        if (Platform.OS === 'ios') {
            return ReceiveSharingIntent.getFileNames(url)
                .then((data) => iosSortedData(data))
                .then(showModal);
        }

        return ReceiveSharingIntent.getFileNames()
            .then((fileObject) =>
                Object.keys(fileObject).map((k) => fileObject[k]),
            )
            .then(showModal);
    };

    const getFileNameIfSharing = (url) => {
        if (url.startsWith('ShareMedia://dataUrl')) {
            getFileNames(url);
        }
    };

    const listenForUrl = (res: { url: string }) =>
        getFileNameIfSharing(res?.url);

    const handleAppStateChange = (status: AppStateStatus) => {
        if (status === 'active') {
            getFileNames();
        }
    };

    useEffect(() => {
        if (Platform.OS === 'ios') {
            Linking.getInitialURL()
                .then(getFileNameIfSharing)
                .catch((e) => {});

            Linking.addEventListener('url', listenForUrl);

            return () => {
                Linking.removeEventListener('url', listenForUrl);
            };
        }

        AppState.addEventListener('change', handleAppStateChange);

        getFileNames();

        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    });
};
