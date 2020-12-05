import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { StyleSheet } from 'react-native';
import { grey100 } from '@/util/style';

export interface WrapperProps {}

const Wrapper: React.FC<WrapperProps> = (props) => {
    return <SafeAreaView style={styles.wrapper}>{props.children}</SafeAreaView>;
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: grey100,
    },
});

export default Wrapper;
