import React, { useEffect, useState } from 'react';
import { View, Keyboard, Platform, KeyboardEvent } from 'react-native';

export interface KeyboardBottomBufferProps {}

const KeyboardBottomBuffer: React.FC<KeyboardBottomBufferProps> = (props) => {
    const [keyboardPaddingHeight, setKeyboardPaddingHeight] = useState(0);

    useEffect(() => {
        if (Platform.OS === 'android') {
            return;
        }

        const onShow = (e: KeyboardEvent) => {
            setKeyboardPaddingHeight(e.endCoordinates.height);
        };

        const onHide = () => {
            setKeyboardPaddingHeight(0);
        };

        Keyboard.addListener('keyboardWillShow', onShow);
        Keyboard.addListener('keyboardWillHide', onHide);

        return () => {
            Keyboard.removeListener('keyboardWillShow', onShow);
            Keyboard.removeListener('keyboardWillHide', onHide);
        };
    }, []);

    if (Platform.OS === 'android') {
        return null;
    }

    return <View style={{ height: keyboardPaddingHeight }} />;
};

export default KeyboardBottomBuffer;
