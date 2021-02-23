import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
} from 'react-native';
import BaseText from '../BaseText';
import { paddingX, paddingY, bsl } from '@/util/style';

interface Props extends TouchableOpacityProps {
    processing?: boolean;
}

const SubmitButton: React.FC<Props> = (props) => {
    const disabled = props.disabled || props.processing;

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
                <BaseText size={30} letterSpacing={1.25} align="center">
                    {props.children.toUpperCase()}
                </BaseText>
            );
        }

        return props.children;
    };

    return (
        <TouchableOpacity
            style={style.button}
            testID={props.testID}
            onPress={props.onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityTraits={disabled ? ['disabled'] : []}>
            {renderButtonContent()}
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    button: {
        backgroundColor: '#FEF3C7',
        ...paddingX(20),
        ...paddingY(20),
        borderRadius: bsl(50),
    },
});

export default SubmitButton;
