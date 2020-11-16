import React from 'react';
import { View, StyleProp, TextStyle, StyleSheet } from 'react-native';
import BodyText from '@/components/BodyText';

interface Props {
    global?: boolean;
    additionalStyles?: StyleProp<TextStyle>;
}

const FormErrorMessage: React.FC<Props> = (props) => (
    <View
        style={[
            props.global ? localStyles.errorGlobal : localStyles.errorInput,
            props.additionalStyles,
        ]}>
        <BodyText align="center" color="white">
            {props.children}
        </BodyText>
    </View>
);

const localStyles = StyleSheet.create({});

export default FormErrorMessage;
