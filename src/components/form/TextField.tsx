import React, { forwardRef } from 'react';
import {
    TextInput,
    View,
    TextInputProps,
    StyleProp,
    TextStyle,
    StyleSheet,
} from 'react-native';
import { useField } from 'formik';
import { ErrorMessage } from 'formik';
import ErrorMessageComponent from '@/components/form/ErrorMessage';
import FieldRequiredIndicator from './FieldRequiredIndicator';
import FieldLabel from './FieldLabel';
import { grey300, bsl, paddingY, paddingX, red400 } from '@/util/style';

export interface TextFieldComponentProps {
    name: string;
    label?: string;
    labelAlign?: 'left' | 'center' | 'right';
    required?: boolean;
    editable?: boolean;
    additionalStyles?: StyleProp<TextStyle>;
    errorComponent?: string | React.ComponentType;
    hideError?: boolean;
}

export type TextFieldProps = TextFieldComponentProps & TextInputProps;

const TextField: React.FC<TextFieldProps> = forwardRef((props, ref) => {
    const [field, meta] = useField(props.name);

    const hasError = props.hideError !== true && meta.touched && meta.error;

    return (
        <>
            {typeof props.label !== 'undefined' && (
                <FieldLabel align={props.labelAlign}>{props.label}</FieldLabel>
            )}
            <View>
                <View>
                    <TextInput
                        ref={ref}
                        maxFontSizeMultiplier={1}
                        onChangeText={field.onChange(props.name)}
                        onBlur={field.onBlur(props.name)}
                        underlineColorAndroid="transparent"
                        value={field.value}
                        testID={field.name}
                        style={[
                            styles.input,
                            props.additionalStyles,
                            hasError ? styles.inputWithError : null,
                        ]}
                        {...props}
                    />
                    <FieldRequiredIndicator
                        required={props.editable && props.required}
                        name={props.name}
                    />
                </View>
                {props.hideError !== true && (
                    <ErrorMessage
                        name={props.name}
                        component={
                            props.errorComponent || ErrorMessageComponent
                        }
                    />
                )}
            </View>
        </>
    );
});

const styles = StyleSheet.create({
    input: {
        borderWidth: bsl(3),
        borderColor: grey300,
        ...paddingY(20), // Keep this this way, multiline won't pad the top correctly otherwise
        ...paddingX(20),
        fontFamily: 'Karla-Regular',
        fontSize: bsl(30),
        backgroundColor: '#fff',
        borderRadius: bsl(50),
    },
    inputWithError: {
        borderColor: red400,
    },
});

export default TextField;
