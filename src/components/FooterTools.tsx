import React from 'react';
import { View, StyleSheet } from 'react-native';
import { centeredRow, bsl } from '@/util/style';

export interface FooterToolsProps {
    center?: boolean;
}

const FooterTools: React.FC<FooterToolsProps> = (props) => {
    return (
        <View
            style={[
                styles.toolsWrapper,
                props.center ? { justifyContent: 'center' } : null,
            ]}>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    toolsWrapper: {
        ...centeredRow,
        paddingHorizontal: bsl(40),
        paddingVertical: bsl(20),
        justifyContent: 'space-between',
    },
});

export default FooterTools;
