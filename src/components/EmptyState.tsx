import React from 'react';
import { View, StyleSheet } from 'react-native';
import BaseText from './BaseText';
import LemonSliceText from './LemonSliceText';

export interface EmptyStateProps {
    subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
    return (
        <View style={styles.wrapper}>
            <LemonSliceText text="N<slice>thing to see here." />
            <BaseText align="center">{props.subtitle}</BaseText>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default EmptyState;
