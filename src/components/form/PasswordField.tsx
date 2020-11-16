import React from 'react';
import TextField, { TextFieldProps } from './TextField';

const PasswordField: React.FC<TextFieldProps> = (props) => (
    <TextField secureTextEntry={true} {...props} />
);

export default PasswordField;
