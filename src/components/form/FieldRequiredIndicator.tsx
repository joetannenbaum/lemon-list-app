import React from 'react';
import { View } from 'react-native';

interface Props {
    required?: boolean;
    editable?: boolean;
    name: string;
}

const InputRequiredIndicator: React.FC<Props> = (props) => {
    if (props.required !== true || props.editable === false) {
        return null;
    }

    return <View testID={`${props.name}Required`} />;
};

export default InputRequiredIndicator;
