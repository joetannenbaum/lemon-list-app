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
                    disabled={props.quantity === 1}
                    onPress={props.onDecreasePress}>
                    <Image
                        source={require('@images/minus-circle.png')}
                        style={[
                            styles.controlIcon,
                            props.quantity === 1
                                ? {
                                      tintColor: grey200,
                                  }
                                : undefined,
                        ]}
                    />
                </TouchableOpacity>
                <View style={styles.textWrapper}>
                    <BaseText size={30}>{props.quantity}</BaseText>
                </View>
                <TouchableOpacity
                    hitSlop={hitSlop}
                    onPress={props.onIncreasePress}>
                    <Image
                        source={require('@images/plus-circle.png')}
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
        ...sizeImage(76, 78, { width: 30 }),
        tintColor: black,
    },
});

export default QuantityControl;
