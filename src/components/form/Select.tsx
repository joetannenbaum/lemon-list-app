import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useField } from 'formik';
import { TextFieldProps } from './TextField';

interface SelectItem {
    label: string;
    value: any;
}

export interface SelectProps {
    items: SelectItem[];
}

const Select: React.FC<SelectProps & TextFieldProps> = (props) => {
    const [field, meta, helpers] = useField(props.name);

    return (
        <RNPickerSelect
            value={field.value}
            onValueChange={(val) => {
                if (val === null) {
                    helpers.setValue('');
                } else {
                    helpers.setValue(val);
                }
            }}
            items={props.items}
        />
    );
};

export default Select;
