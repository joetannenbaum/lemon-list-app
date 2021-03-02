import React from 'react';
import { View, StyleProp, TextStyle, StyleSheet } from 'react-native';
import BaseText from '@/components/BaseText';
import { red400, bsl } from '@/util/style';

interface Props {
    global?: boolean;
    additionalStyles?: StyleProp<TextStyle>;
}

const FormErrorMessage: React.FC<Props> = (props) => (
    <View style={styles.input}>
        <BaseText size={26} align="center" color={red400}>
            {props.children}
        </BaseText>
    </View>
);

const styles = StyleSheet.create({
    input: {
        padding: bsl(15),
    },
});

export default FormErrorMessage;
