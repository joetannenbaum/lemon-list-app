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
    const getTextStyle = () => {
        const textStyle = props.style ? [props.style] : [];

        textStyle.push({ fontFamily: props.fontFamily || 'Karla-Regular' });

        textStyle.push({ color: props.color || black });

        if (props.align) {
            textStyle.push({ textAlign: props.align });
        }

        if (props.size) {
            textStyle.push({ fontSize: bsl(props.size) });
        }

        if (typeof props.lineHeight !== 'undefined') {
            textStyle.push({
                lineHeight: bsl(props.lineHeight),
            });
        } else {
            textStyle.push({
                lineHeight: bsl(1.25 * (props.size || 12)),
            });
        }

        if (props.bold) {
            textStyle.push({ fontWeight: '700' });
        }

        if (typeof props.letterSpacing !== 'undefined') {
            textStyle.push({ letterSpacing: bsl(props.letterSpacing) });
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
