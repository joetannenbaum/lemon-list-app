import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { sizeImage, bsl, red400 } from '@/util/style';

export interface SwipeDeleteProps {
    onPress: () => void;
}

const SwipeDelete: React.FC<SwipeDeleteProps> = (props) => {
    return (
        <View style={styles.deleteWrapper}>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={props.onPress}>
                <Image
                    source={require('@images/trash.png')}
                    style={styles.trashIcon}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    deleteWrapper: {
        backgroundColor: red400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        paddingHorizontal: bsl(30),
    },
    trashIcon: {
        ...sizeImage(61, 68, { width: 40 }),
        tintColor: '#fff',
    },
});

export default SwipeDelete;
