import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bsl, yellow200 } from '@/util/style';
import KeyboardBottomBuffer from './KeyboardBottomBuffer';

export interface FooterProps {
    color: string;
}

const Footer: React.FC<FooterProps> = (props) => {
    const { bottom } = useSafeAreaInsets();

    return (
        <>
            <View
                style={[
                    styles.footer,
                    {
                        paddingBottom: bottom,
                    },
                ]}>
                {props.children}
            </View>
            <KeyboardBottomBuffer />
        </>
    );
};

const styles = StyleSheet.create({
    footer: {
        paddingHorizontal: bsl(20),
        backgroundColor: yellow200,
    },
});

export default Footer;
