import React from 'react';
import TextField, { TextFieldProps } from './TextField';
import { useField } from 'formik';
import { bsl } from '@/util/style';
import BaseText from '@/components/BaseText';
import { StyleSheet, View } from 'react-native';

const AutoGrowTextField: React.FC<TextFieldProps> = (props) => {
    const [field] = useField(props.name);

    const renderMaxLength = () => {
        if (typeof props.maxLength === 'undefined') {
            return null;
        }

        return (
            <View style={styles.lengthTextWrapper}>
                <BaseText size={20}>
                    {field.value.length}/{props.maxLength}
                </BaseText>
            </View>
        );
    };

    return (
        <>
            <TextField
                multiline={true}
                {...props}
                additionalStyles={styles.input}
            />
            {renderMaxLength()}
        </>
    );
};

const styles = StyleSheet.create({
    lengthTextWrapper: {
        paddingTop: bsl(5),
        paddingRight: bsl(20),
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    input: {
        maxHeight: bsl(150),
    },
});

export default AutoGrowTextField;
