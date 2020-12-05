import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
    centeredRow,
    sizeImage,
    paddingX,
    bsl,
    flexCenter,
} from '@/util/style';
import BaseText from './BaseText';

export interface QuantityControlProps {
    quantity: number;
    onIncreasePress: () => void;
    onDecreasePress: () => void;
}

const QuantityControl: React.FC<QuantityControlProps> = (props) => {
    return (
        <View>
            <View style={styles.wrapper}>
                <TouchableOpacity
                    disabled={props.quantity === 1}
                    onPress={props.onDecreasePress}>
                    <Image
                        source={require('@images/subtract-circle.png')}
                        style={styles.controlIcon}
                    />
                </TouchableOpacity>
                <View style={styles.textWrapper}>
                    <BaseText size={30}>{props.quantity}</BaseText>
                </View>
                <TouchableOpacity onPress={props.onIncreasePress}>
                    <Image
                        source={require('@images/add-circle.png')}
                        style={styles.controlIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        ...centeredRow,
    },
    textWrapper: {
        minWidth: bsl(50),
        ...paddingX(10),
        ...flexCenter,
    },
    controlIcon: {
        ...sizeImage(10, 10, { width: 30 }),
    },
});

export default QuantityControl;
