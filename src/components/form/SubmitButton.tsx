import React, { useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    Animated,
    Image,
    View,
} from 'react-native';
import BaseText from '../BaseText';
import {
    bsl,
    grey400,
    grey200,
    yellow100,
    sizeImage,
    black,
} from '@/util/style';

interface Props extends TouchableOpacityProps {
    processing?: boolean;
}

const SubmitButton: React.FC<Props> = (props) => {
    const disabled = props.disabled || props.processing;

    const animatedValue = useRef(new Animated.Value(0));

    useEffect(() => {
        if (props.processing) {
            Animated.loop(
                Animated.timing(animatedValue.current, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 2000,
                }),
            ).start();
        }
    }, [props.processing]);

    const renderButtonContent = () => {
        if (props.processing) {
            return (
                <View style={styles.loadingIconWrapper}>
                    <Animated.Image
                        source={require('@images/lemon-slice.png')}
                        style={[
                            styles.loadingIcon,
                            {
                                transform: [
                                    {
                                        rotate: animatedValue.current.interpolate(
                                            {
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg'],
                                            },
                                        ),
                                    },
                                ],
                            },
                        ]}
                    />
                </View>
            );
        }

        if (typeof props.children === 'string') {
            return (
                <BaseText
                    color={disabled ? grey400 : undefined}
                    size={30}
                    letterSpacing={3}
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
        padding: bsl(20),
        borderRadius: bsl(50),
    },
    processing: {
        opacity: 0.85,
    },
    disabled: {
        backgroundColor: grey200,
    },
    loadingIconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIcon: {
        ...sizeImage(10, 10, { width: 38 }),
        tintColor: black,
    },
});

export default SubmitButton;
