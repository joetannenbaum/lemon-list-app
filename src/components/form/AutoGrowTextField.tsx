import React from 'react';
import TextField, { TextFieldProps } from './TextField';
import { useField } from 'formik';
import { bsl } from '@/util/style';
import BaseText from '../BaseText';

const AutoGrowTextField: React.FC<TextFieldProps> = (props) => {
    const [field] = useField(props.name);

    const renderMaxLength = () => {
        if (typeof props.maxLength === 'undefined') {
            return null;
        }

        return (
            <BaseText>
                {field.value.length}/{props.maxLength}
            </BaseText>
        );
    };

    const shouldPadBottom = props.maxLength;

    return (
        <>
            <TextField
                multiline={true}
                {...props}
                additionalStyles={[
                    {
                        borderColor: '#000',
                        borderWidth: 1,
                        minHeight: bsl(350),
                    },
                    shouldPadBottom
                        ? {
                              paddingBottom: bsl(100),
                          }
                        : null,
                    props.additionalStyles,
                ]}
            />
            {renderMaxLength()}
        </>
    );
};

export default AutoGrowTextField;
