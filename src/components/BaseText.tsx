import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import capitalize from 'lodash/capitalize';
import { bsl } from '@/util/style';

export interface BaseTextProps extends TextProps {
    textStyle?: StyleProp<TextStyle>;
    color?: string;
    align?: 'left' | 'center' | 'right';
    size?: number;
    lineHeight?: number;
    bold?: boolean;
    letterSpacing?: number;
}

const BaseText: React.FC<BaseTextProps> = (props) => {
    const getTextStyle = () => {
        let textStyle = [props.textStyle];

        if (props.style) {
            textStyle = textStyle.concat(props.style);
        }

        if (props.color) {
            // textStyle.push(styles[`text${capitalize(props.color)}`]);
        }

        if (props.align) {
            textStyle.push({ textAlign: props.align });
        }

        if (props.size) {
            textStyle.push({ fontSize: bsl(props.size) });
        }

        if (props.lineHeight) {
            textStyle.push({ lineHeight: bsl(props.lineHeight) });
        }

        if (props.bold) {
            textStyle.push({ fontWeight: '700' });
            // textStyle.push(styles.bodyTextBold);
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
