import React, { useRef, forwardRef } from 'react';
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
import { grey300, bsl, paddingY, paddingX } from '@/util/style';

export interface TextFieldComponentProps {
    name: string;
    label?: string;
    labelAlign?: 'left' | 'center' | 'right';
    required?: boolean;
    editable?: boolean;
    additionalStyles?: StyleProp<TextStyle>;
    errorComponent?: string | React.ComponentType;
}

export type TextFieldProps = TextFieldComponentProps & TextInputProps;

const TextField: React.FC<TextFieldProps> = forwardRef((props, ref) => {
    const [field, meta] = useField(props.name);
    const inputRef = useRef<TextInput>();

    const hasError = meta.touched && meta.error;

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
                        style={[styles.input, props.additionalStyles]}
                        {...props}
                    />
                    <FieldRequiredIndicator
                        required={props.editable && props.required}
                        name={props.name}
                    />
                </View>
                <ErrorMessage
                    name={props.name}
                    component={props.errorComponent || ErrorMessageComponent}
                />
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
});

export default TextField;
