import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { bsl, sizeImage } from '@/util/style';
import BaseText from './BaseText';

export interface ArrowButtonProps {
    onPress: () => void;
}

const ArrowButton: React.FC<ArrowButtonProps> = (props) => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
            <View style={styles.textWrapper}>
                <BaseText>{props.children}</BaseText>
            </View>
            <Image
                source={require('@images/carat-right.png')}
                style={styles.carat}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: bsl(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    carat: sizeImage(16, 24, { width: 16 }),
    textWrapper: {
        flex: 1,
        paddingRight: bsl(20),
    },
    divider: {
        marginVertical: bsl(20),
    },
});

export default ArrowButton;
