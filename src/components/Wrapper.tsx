import React from 'react';
import SafeAreaView, { ForceInsetProp } from 'react-native-safe-area-view';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { grey100 } from '@/util/style';

export interface WrapperProps {
    forceInset?: ForceInsetProp;
    style?: StyleProp<ViewStyle>;
}

const Wrapper: React.FC<WrapperProps> = (props) => {
    return (
        <SafeAreaView
            forceInset={props.forceInset}
            style={[styles.wrapper, props.style]}>
            {props.children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Wrapper;
