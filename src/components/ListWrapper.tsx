import React from 'react';
import { StyleSheet, View } from 'react-native';
import { bsl } from '@/util/style';

export interface ListWrapperProps {}

const ListWrapper: React.FC<ListWrapperProps> = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.wrapper}>
                <View style={styles.innerWrapper}>
                    <View style={styles.contentWrapper}>{props.children}</View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    wrapper: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: bsl(1),
        },
        shadowRadius: bsl(3),
        shadowOpacity: 0.1,
        flexDirection: 'row',
        flex: 1,
        borderRadius: bsl(10),
    },
    innerWrapper: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: {
            width: 0,
            height: bsl(2),
        },
        shadowRadius: 0,
        flex: 1,
        borderRadius: bsl(10),
    },
    contentWrapper: {
        borderRadius: bsl(10),
        overflow: 'hidden',
    },
});

export default ListWrapper;
