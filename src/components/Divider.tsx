import React from 'react';
import { View, StyleSheet } from 'react-native';
import { bsl, grey300 } from '@/util/style';

export interface DividerProps {}

const Divider: React.FC<DividerProps> = (props) => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        height: bsl(3),
        backgroundColor: grey300,
    },
});

export default Divider;
