import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useField, useFormikContext } from 'formik';
import { TextFieldProps } from './TextField';

interface SelectItem {
    label: string;
    value: any;
}

export interface SelectProps {
    items: SelectItem[];
}

const Select: React.FC<SelectProps & TextFieldProps> = (props) => {
    const [field] = useField(props.name);
    const form = useFormikContext();

    return (
        <RNPickerSelect
            value={field.value}
            onValueChange={(val) => {
                if (val === null) {
                    form.setFieldValue(props.name, '');
                } else {
                    form.setFieldValue(props.name, val);
                }
            }}
            items={props.items}
        />
    );
};

export default Select;
