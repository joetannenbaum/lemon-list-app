import React from 'react';
import { View } from 'react-native';
import BodyText from '../BodyText';

interface Props {}

const FieldLabel: React.FC<Props> = (props) => {
    return !props.children ? null : (
        <View>
            <BodyText {...props}>{props.children}</BodyText>
        </View>
    );
};

export default FieldLabel;
