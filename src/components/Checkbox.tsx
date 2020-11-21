import React from 'react';
import { TouchableOpacity } from 'react-native';

export interface CheckboxProps {
    checked: boolean;
    onPress: () => void;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
    return (
        <TouchableOpacity
            style={{
                width: 18,
                height: 18,
                borderColor: 'black',
                borderWidth: 1,
                marginRight: 5,
                backgroundColor: props.checked ? 'black' : 'white',
            }}
            onPress={props.onPress}
        />
    );
};

export default Checkbox;
