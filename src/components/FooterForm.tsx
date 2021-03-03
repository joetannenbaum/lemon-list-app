import React from 'react';
import { View, StyleSheet } from 'react-native';
import { bsl } from '@/util/style';

export interface FooterFormProps {
    center?: boolean;
}

const FooterForm: React.FC<FooterFormProps> = (props) => {
    return <View style={styles.addFormWrapper}>{props.children}</View>;
};

const styles = StyleSheet.create({
    addFormWrapper: {
        zIndex: 100,
        paddingBottom: bsl(20),
        paddingTop: bsl(40),
    },
});

export default FooterForm;
