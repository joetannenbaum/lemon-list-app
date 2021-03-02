import React from 'react';
import { View, StyleSheet } from 'react-native';
import BaseText from '../BaseText';
import { bsl } from '@/util/style';

interface Props {
    align?: 'left' | 'center' | 'right';
}

const FieldLabel: React.FC<Props> = (props) => {
    return !props.children ? null : (
        <View style={styles.wrapper}>
            <BaseText {...props}>{props.children}</BaseText>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingLeft: bsl(30),
        paddingBottom: bsl(10),
    },
});

export default FieldLabel;
