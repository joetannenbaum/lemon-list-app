import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bsl } from '@/util/style';

export interface FooterProps {
    color: string;
}

const Footer: React.FC<FooterProps> = (props) => {
    const { bottom } = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.footer,
                {
                    backgroundColor: props.color,
                    paddingBottom: bottom,
                },
            ]}>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        paddingHorizontal: bsl(20),
    },
});

export default Footer;
