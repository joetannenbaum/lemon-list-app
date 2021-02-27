import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
} from 'react-native';
import BaseText from '../BaseText';
import { bsl, grey400 } from '@/util/style';

interface Props {}

const CancelButton: React.FC<Props & TouchableOpacityProps> = (props) => {
    return (
        <TouchableOpacity
            style={style.button}
            testID={props.testID}
            onPress={props.onPress}
            accessibilityRole="button">
            <BaseText color={grey400} align="center">
                {props.children || 'Cancel'}
            </BaseText>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    button: {
        marginTop: bsl(30),
    },
});

export default CancelButton;
