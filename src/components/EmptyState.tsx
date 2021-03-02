import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import BaseText from './BaseText';
import { sizeImage, bsl } from '@/util/style';

export interface EmptyStateProps {
    subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.titleWrapper}>
                <BaseText size={55}>N</BaseText>
                <Image
                    style={styles.lemonSlice}
                    source={require('@images/lemon-slice-small.png')}
                />
                <BaseText size={55}>thing to see here.</BaseText>
            </View>
            <BaseText>{props.subtitle}</BaseText>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    titleWrapper: {
        flexDirection: 'row',
        paddingBottom: bsl(20),
    },
    lemonSlice: {
        ...sizeImage(10, 10, { width: 45 }),
        marginTop: bsl(14),
        marginRight: bsl(2),
    },
});

export default EmptyState;
