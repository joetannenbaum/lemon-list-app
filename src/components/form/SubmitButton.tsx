import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import BaseText from '../BaseText';

interface Props extends TouchableOpacityProps {
    processing?: boolean;
}

const SubmitButton: React.FC<Props> = (props) => {
    const disabled = props.disabled || props.processing;

    const renderButtonContent = () => {
        if (props.processing) {
            return <BaseText>One sec...</BaseText>;
        }

        if (typeof props.children === 'string') {
            return (
                <BaseText size={40} align="center">
                    {props.children}
                </BaseText>
            );
        }

        return props.children;
    };

    return (
        <TouchableOpacity
            testID={props.testID}
            onPress={props.onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityStates={disabled ? ['disabled'] : []}
            accessibilityTraits={disabled ? ['disabled'] : []}>
            {renderButtonContent()}
        </TouchableOpacity>
    );
};

export default SubmitButton;
