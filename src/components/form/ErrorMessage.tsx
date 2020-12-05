import React from 'react';
import { View, StyleProp, TextStyle, StyleSheet } from 'react-native';
import BaseText from '@/components/BaseText';

interface Props {
    global?: boolean;
    additionalStyles?: StyleProp<TextStyle>;
}

const FormErrorMessage: React.FC<Props> = (props) => (
    <View
        style={[
            props.global ? styels.errorGlobal : styels.errorInput,
            props.additionalStyles,
        ]}>
        <BaseText align="center" color="white">
            {props.children}
        </BaseText>
    </View>
);

const styels = StyleSheet.create({});

export default FormErrorMessage;
