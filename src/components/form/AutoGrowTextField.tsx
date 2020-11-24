import React from 'react';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import TextField, { TextFieldProps } from './TextField';
import { useField } from 'formik';
import { bsl } from '@/util/style';
import BodyText from '../BodyText';

type Props = TextFieldProps;

const AutoGrowTextField: React.FC<TextFieldProps> = (props) => {
    const [field] = useField(props.name);

    const renderMaxLength = () => {
        if (typeof props.maxLength === 'undefined') {
            return null;
        }

        return (
            <BodyText>
                {field.value.length}/{props.maxLength}
            </BodyText>
        );
    };

    const shouldPadBottom = props.maxLength;

    return (
        <>
            <TextField
                component={AutoGrowingTextInput}
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
