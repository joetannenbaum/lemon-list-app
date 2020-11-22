import React from 'react';
import { useEffect } from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { handleDynamicLink } from '@/util/navigation';

export default () => {
    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

        // When the is component unmounted, remove the listener
        return () => {
            unsubscribe();
        };
    }, []);
};
