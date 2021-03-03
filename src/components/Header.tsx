import React from 'react';
import { View, StyleSheet } from 'react-native';
import MenuButton from './MenuButton';
import BaseText from './BaseText';
import { flexCenter, bsl } from '@/util/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
    color: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { top } = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.headerWrapper,
                {
                    paddingTop: top,
                    backgroundColor: props.color,
                },
            ]}>
            <View
                style={[
                    styles.menuButtonWrapper,
                    {
                        top: bsl(45) + top,
                    },
                ]}>
                <MenuButton />
            </View>
            <View style={styles.header}>
                <BaseText size={50}>{props.children}</BaseText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        ...flexCenter,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: bsl(1),
        },
        shadowRadius: bsl(3),
        shadowOpacity: 0.1,
        zIndex: 50,
    },
    header: {
        paddingHorizontal: bsl(80),
        paddingVertical: bsl(30),
    },
    menuButtonWrapper: {
        position: 'absolute',
        left: bsl(20),
    },
});

export default Header;
