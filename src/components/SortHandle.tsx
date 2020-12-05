import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { sizeImage, flexCenter, paddingX } from '@/util/style';

export interface SortHandleProps {}

const SortHandle: React.FC<SortHandleProps> = (props) => {
    return (
        <View style={styles.wrapper}>
            <Image
                source={require('@images/gripper.png')}
                style={styles.gripper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#E5E7EB',
        alignSelf: 'stretch',
        ...flexCenter,
        ...paddingX(10),
    },
    gripper: {
        ...sizeImage(33, 70, { width: 15 }),
        tintColor: '#9CA3AF',
    },
});

export default SortHandle;
