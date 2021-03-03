import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface FooterProps {
    color: string;
}

const Footer: React.FC<FooterProps> = (props) => {
    const { bottom } = useSafeAreaInsets();

    return (
        <View
            style={{
                backgroundColor: props.color,
                paddingBottom: bottom,
            }}>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({});

export default Footer;
