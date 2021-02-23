import React from 'react';
import { View, StyleSheet } from 'react-native';
import { flexCenter, paddingX, black, bsl, marginY } from '@/util/style';

export interface SortHandleProps {}

const SortHandle: React.FC<SortHandleProps> = (props) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.inner}>
                {Array(8)
                    .fill(null)
                    .map((_, i) => {
                        return (
                            <View style={styles.dotWrapper}>
                                <View style={styles.dot} key={`dot-${i}`} />
                            </View>
                        );
                    })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRightColor: black,
        borderRightWidth: bsl(3),
        ...marginY(-10),
        ...flexCenter,
        ...paddingX(5),
        width: bsl(40),
    },
    inner: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    dotWrapper: {
        width: '50%',
        height: bsl(15),
        ...flexCenter,
    },
    dot: {
        backgroundColor: black,
        borderRadius: bsl(5),
        height: bsl(5),
        width: bsl(5),
    },
});

export default SortHandle;
