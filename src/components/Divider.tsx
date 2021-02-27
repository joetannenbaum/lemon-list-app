import React from 'react';
import { View, StyleSheet } from 'react-native';
import { bsl, grey300 } from '@/util/style';

export interface DividerProps {
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
}

const Divider: React.FC<DividerProps> = (props) => {
    return (
        <View
            style={[
                styles.divider,
                props.margin ? { marginVertical: bsl(props.margin) } : null,
                props.marginTop ? { marginTop: bsl(props.marginTop) } : null,
                props.marginBottom
                    ? { marginBottom: bsl(props.marginBottom) }
                    : null,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    divider: {
        height: bsl(3),
        backgroundColor: grey300,
    },
});

export default Divider;
