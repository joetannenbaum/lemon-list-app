import React from 'react';
import TextField, { TextFieldProps } from './TextField';

const TextareaField: React.FC<TextFieldProps> = (props) => {
    return <TextField multiline={true} {...props} />;
};

export default TextareaField;
