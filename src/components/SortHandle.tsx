import React from 'react';
import { View } from 'react-native';
import BodyText from './BodyText';

export interface SortHandleProps {}

const SortHandle: React.FC<SortHandleProps> = (props) => {
    return (
        <View style={{ paddingRight: 15 }}>
            <BodyText>:::</BodyText>
        </View>
    );
};

export default SortHandle;
