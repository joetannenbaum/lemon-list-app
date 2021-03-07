import React from 'react';
import { Text, TextProps, View } from 'react-native';
import { bsl, black } from '@/util/style';

export interface BaseTextProps {
    color?: string;
    align?: 'left' | 'center' | 'right';
    size?: number;
    lineHeight?: number;
    bold?: boolean;
    letterSpacing?: number;
    fontFamily?: string;
}

type TextComponentProps = BaseTextProps & TextProps;

export interface LetterProps {
    isFirst: boolean;
}

const TextComponent: React.FC<TextComponentProps> = (props) => {
    const defaultFontSize = 30;

    return (
        <Text
            maxFontSizeMultiplier={1}
            allowFontScaling={false}
            onPress={props.onPress}
            {...props}
            style={[
                {
                    fontFamily: props.bold
                        ? 'Karla-Bold'
                        : props.fontFamily || 'Karla-Regular',
                    color: props.color || black,
                    fontSize: bsl(props.size || defaultFontSize),
                    textAlign: props.align,
                    lineHeight:
                        typeof props.lineHeight !== 'undefined'
                            ? bsl(props.lineHeight)
                            : bsl(1.25 * (props.size || defaultFontSize)),
                },
                props.style,
            ]}>
            {props.children}
        </Text>
    );
};

const Letter: React.FC<TextComponentProps & LetterProps> = (props) => {
    return (
        <TextComponent
            {...props}
            style={[
                props.style,
                { paddingLeft: props.isFirst ? 0 : bsl(props.letterSpacing) },
            ]}>
            {props.children}
        </TextComponent>
    );
};

const BaseText: React.FC<TextComponentProps> = (props) => {
    if (
        typeof props.letterSpacing !== 'undefined' &&
        typeof props.children === 'string'
    ) {
        return (
            <View
                style={[
                    { flexDirection: 'row' },
                    typeof props.align !== 'undefined' &&
                        props.align !== 'left' && {
                            justifyContent:
                                props.align === 'center'
                                    ? 'center'
                                    : 'flex-end',
                        },
                ]}>
                {props.children.split('').map((letter, index) => (
                    <Letter
                        key={index.toString()}
                        isFirst={index === 0}
                        {...props}>
                        {letter}
                    </Letter>
                ))}
            </View>
        );
    }

    return <TextComponent {...props}>{props.children}</TextComponent>;
};

export default BaseText;
