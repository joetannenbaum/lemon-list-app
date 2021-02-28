import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Insets,
} from 'react-native';
import {
    centeredRow,
    sizeImage,
    paddingX,
    bsl,
    flexCenter,
    grey200,
    black,
} from '@/util/style';
import BaseText from './BaseText';

export interface QuantityControlProps {
    quantity: number;
    onIncreasePress: () => void;
    onDecreasePress: () => void;
    disabled?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = (props) => {
    const hitSlop: Insets = {
        top: bsl(10),
        bottom: bsl(10),
        right: bsl(10),
        left: bsl(10),
    };

    return (
        <View>
            <View style={styles.wrapper}>
                <TouchableOpacity
                    hitSlop={hitSlop}
                    disabled={props.quantity === 1 || props.disabled}
                    onPress={props.onDecreasePress}>
                    <Image
                        source={require('@images/minus-circle.png')}
                        style={[
                            styles.controlIcon,
                            props.quantity === 1 || props.disabled
                                ? {
                                      tintColor: grey200,
                                  }
                                : undefined,
                        ]}
                    />
                </TouchableOpacity>
                <View style={styles.textWrapper}>
                    <BaseText
                        color={props.disabled ? grey200 : undefined}
                        size={30}>
                        {props.quantity}
                    </BaseText>
                </View>
                <TouchableOpacity
                    disabled={props.disabled}
                    hitSlop={hitSlop}
                    onPress={props.onIncreasePress}>
                    <Image
                        source={require('@images/plus-circle.png')}
                        style={[
                            styles.controlIcon,
                            props.disabled
                                ? {
                                      tintColor: grey200,
                                  }
                                : undefined,
                        ]}
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
        ...sizeImage(76, 78, { width: 30 }),
        tintColor: black,
    },
});

export default QuantityControl;
