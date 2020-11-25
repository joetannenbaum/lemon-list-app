import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
            <TouchableOpacity onPress={props.onDecreasePress}>
                <BodyText>-</BodyText>
            </TouchableOpacity>
            <BodyText>{props.quantity}</BodyText>
            <TouchableOpacity onPress={props.onIncreasePress}>
                <BodyText>+</BodyText>
            </TouchableOpacity>
        </View>
    );
};

export default QuantityControl;
