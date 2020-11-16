import React from 'react';
import TextField, { TextFieldProps } from './TextField';

const EmailField: React.FC<TextFieldProps> = (props) => (
    <TextField
        keyboardType="email-address"
        autoCompleteType="off"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
    />
);

export default EmailField;
