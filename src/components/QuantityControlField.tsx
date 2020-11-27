import React from 'react';
import { TextFieldProps } from './form/TextField';
import { useField } from 'formik';
import QuantityControl from './QuantityControl';

const QuantityControlField: React.FC<TextFieldProps> = (props) => {
    const [field, meta, helpers] = useField(props.name);

    const onIncreasePress = () => {
        helpers.setValue(Math.max(1, ++field.value));
    };

    const onDecreasePress = () => {
        helpers.setValue(--field.value);
    };

    return (
        <QuantityControl
            quantity={field.value}
            onIncreasePress={onIncreasePress}
            onDecreasePress={onDecreasePress}
        />
    );
};

export default QuantityControlField;
