import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { StyleSheet } from 'react-native';
import { lightGrey } from '@/util/style';

export interface WrapperProps {}

const Wrapper: React.FC<WrapperProps> = (props) => {
    return <SafeAreaView style={styles.wrapper}>{props.children}</SafeAreaView>;
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: lightGrey,
    },
});

export default Wrapper;
