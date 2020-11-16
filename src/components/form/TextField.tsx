import React, { useRef, useEffect } from 'react';
import {
    TextInput,
    View,
    TextInputProps,
    StyleProp,
    TextStyle,
} from 'react-native';
import { useField } from 'formik';
import { ErrorMessage } from 'formik';
import ErrorMessageComponent from '@/components/form/ErrorMessage';
import FieldRequiredIndicator from './FieldRequiredIndicator';
import FieldLabel from './FieldLabel';

export interface TextFieldProps extends TextInputProps {
    name: string;
    label?: string;
    labelAlign?: 'left' | 'center' | 'right';
    component?: React.FC;
    required?: boolean;
    editable?: boolean;
    additionalStyles?: StyleProp<TextStyle>;
    errorComponent?: string | React.ComponentType;
    onInputRef?: Function;
}

const TextField: React.FC<TextFieldProps> = (props) => {
    const [field, meta] = useField(props.name);
    const inputRef = useRef<TextInput>();

    useEffect(() => {
        if (props.onInputRef) {
            props.onInputRef(inputRef.current);
        }
    }, [inputRef.current]);

    const InputComponent = props.component || TextInput;

    const hasError = meta.touched && meta.error;

    return (
        <>
            {typeof props.label !== 'undefined' && (
                <FieldLabel align={props.labelAlign}>{props.label}</FieldLabel>
            )}
            <View>
                <View>
                    <InputComponent
                        ref={(ref: TextInput) => (inputRef.current = ref)}
                        maxFontSizeMultiplier={1}
                        onChangeText={field.onChange(props.name)}
                        onBlur={field.onBlur(props.name)}
                        underlineColorAndroid="transparent"
                        value={field.value}
                        testID={field.name}
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
};

export default TextField;
