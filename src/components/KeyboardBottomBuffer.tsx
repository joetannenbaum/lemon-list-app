import React, { useEffect, useState } from 'react';
import { View, Keyboard, Platform } from 'react-native';

export interface KeyboardBottomBufferProps {}

const KeyboardBottomBuffer: React.FC<KeyboardBottomBufferProps> = (props) => {
    const [keyboardPaddingHeight, setKeyboardPaddingHeight] = useState(0);

    useEffect(() => {
        if (Platform.OS === 'android') {
            return;
        }

        Keyboard.addListener('keyboardWillShow', (e) => {
            setKeyboardPaddingHeight(e.endCoordinates.height);
        });

        Keyboard.addListener('keyboardWillHide', (e) => {
            setKeyboardPaddingHeight(0);
        });
    }, []);

    if (Platform.OS === 'android') {
        return null;
    }

    return <View style={{ height: keyboardPaddingHeight }} />;
};

export default KeyboardBottomBuffer;
