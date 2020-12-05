import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import BodyText from './BodyText';

export interface QuantityControlProps {
    quantity: number;
    onIncreasePress: () => void;
    onDecreasePress: () => void;
}

const QuantityControl: React.FC<QuantityControlProps> = (props) => {
    return (
        <View
            style={{
                flexDirection: 'row',
            }}>
            <TouchableOpacity
                disabled={props.quantity === 1}
                onPress={props.onDecreasePress}>
                <BodyText>-</BodyText>
            </TouchableOpacity>
            <BodyText>{props.quantity}</BodyText>
            <TouchableOpacity onPress={props.onIncreasePress}>
                <BodyText>+</BodyText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({});

export default QuantityControl;
