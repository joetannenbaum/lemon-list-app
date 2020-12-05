import React from 'react';
import { Text, TextProps } from 'react-native';
import { bsl, black } from '@/util/style';

export interface BaseTextProps extends TextProps {
    color?: string;
    align?: 'left' | 'center' | 'right';
    size?: number;
    lineHeight?: number;
    bold?: boolean;
    letterSpacing?: number;
    fontFamily?: string;
}

const BaseText: React.FC<BaseTextProps> = (props) => {
    const defaultFontSize = 30;

    const getTextStyle = () => {
        const textStyle = [];

        textStyle.push({ fontFamily: props.fontFamily || 'Karla-Regular' });

        textStyle.push({ color: props.color || black });

        if (props.align) {
            textStyle.push({ textAlign: props.align });
        }

        textStyle.push({ fontSize: bsl(props.size || defaultFontSize) });

        if (typeof props.lineHeight !== 'undefined') {
            textStyle.push({
                lineHeight: bsl(props.lineHeight),
            });
        } else {
            textStyle.push({
                lineHeight: bsl(1.25 * (props.size || defaultFontSize)),
            });
        }

        if (props.bold) {
            textStyle.push({ fontWeight: '700' });
        }

        if (typeof props.letterSpacing !== 'undefined') {
            textStyle.push({ letterSpacing: bsl(props.letterSpacing) });
        }

        if (props.style) {
            textStyle.push(props.style);
        }

        if (textStyle.length === 1) {
            return textStyle[0];
        }

        return textStyle;
    };

    return (
        <Text
            maxFontSizeMultiplier={1}
            allowFontScaling={false}
            onPress={props.onPress}
            {...props}
            style={getTextStyle()}>
            {props.children}
        </Text>
    );
};

export default BaseText;
