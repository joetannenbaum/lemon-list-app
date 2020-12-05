import React from 'react';
import { View } from 'react-native';
import BaseText from '../BaseText';

interface Props {}

const FieldLabel: React.FC<Props> = (props) => {
    return !props.children ? null : (
        <View>
            <BaseText {...props}>{props.children}</BaseText>
        </View>
    );
};

export default FieldLabel;
