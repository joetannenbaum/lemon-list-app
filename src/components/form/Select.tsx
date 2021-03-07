import React, { useCallback } from 'react';
import { useField } from 'formik';
import { TextFieldProps } from './TextField';
import BaseText from '../BaseText';
import { grey400 } from '@/util/style';
import { TouchableOpacity } from 'react-native';
import { SelectItem } from '@/types/navigation';
import { showPopup } from '@/util/navigation';

export interface SelectProps {
    items: SelectItem[];
}

const Select: React.FC<SelectProps & TextFieldProps> = (props) => {
    const [field, meta, helpers] = useField(props.name);

    const onPress = useCallback(() => {
        showPopup('SelectPopup', {
            items: props.items,
            selected: field.value,
            onSelect(item: SelectItem | null) {
                if (item === null) {
                    helpers.setValue('');
                } else {
                    helpers.setValue(item.value);
                }
            },
        });
    }, [field.value]);

    const selected = props.items.find((item) => item.value === field.value);

    return (
        <TouchableOpacity onPress={onPress}>
            {typeof selected === 'undefined' ? (
                <BaseText color={grey400}>Select an item</BaseText>
            ) : (
                <BaseText>{selected.label}</BaseText>
            )}
        </TouchableOpacity>
    );
};

export default Select;
