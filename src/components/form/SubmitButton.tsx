import React, { useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    Animated,
} from 'react-native';
import BaseText from '../BaseText';
import {
    paddingX,
    paddingY,
    bsl,
    grey400,
    grey200,
    yellow100,
} from '@/util/style';

interface Props extends TouchableOpacityProps {
    processing?: boolean;
}

const SubmitButton: React.FC<Props> = (props) => {
    const disabled = props.disabled || props.processing;

    // const animatedValue = useRef(new Animated.Value(0))

    // useEffect(() => {

    // }, [disabled])

    const renderButtonContent = () => {
        if (props.processing) {
            return (
                <BaseText size={30} letterSpacing={1.25} align="center">
                    ONE SEC...
                </BaseText>
            );
        }

        if (typeof props.children === 'string') {
            return (
                <BaseText
                    color={disabled ? grey400 : undefined}
                    size={30}
                    letterSpacing={1.25}
                    align="center">
                    {props.children.toUpperCase()}
                </BaseText>
            );
        }

        return props.children;
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                props.processing && styles.processing,
                ,
                disabled && !props.processing && styles.disabled,
            ]}
            testID={props.testID}
            onPress={props.onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityTraits={disabled ? ['disabled'] : []}>
            {renderButtonContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: yellow100,
        ...paddingX(20),
        ...paddingY(20),
        borderRadius: bsl(50),
    },
    processing: {
        opacity: 0.85,
    },
    disabled: {
        backgroundColor: grey200,
    },
});

export default SubmitButton;
