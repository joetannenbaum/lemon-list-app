import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { sizeImage, bsl, blue400 } from '@/util/style';

export interface SwipeMoveProps {
    onMove: (direction: 1 | -1) => void;
    isFirst: boolean;
    isLast: boolean;
}

const SwipeMove: React.FC<SwipeMoveProps> = (props) => {
    return (
        <View style={styles.moveWrapper}>
            {!props.isFirst && (
                <TouchableOpacity
                    style={styles.moveButton}
                    onPress={() => props.onMove(-1)}>
                    <Image
                        source={require('@images/arrow-down.png')}
                        style={[styles.moveIcon, styles.moveUpIcon]}
                    />
                </TouchableOpacity>
            )}
            {!props.isLast && (
                <TouchableOpacity
                    style={styles.moveButton}
                    onPress={() => props.onMove(1)}>
                    <Image
                        source={require('@images/arrow-down.png')}
                        style={styles.moveIcon}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    moveWrapper: {
        backgroundColor: blue400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moveButton: {
        paddingHorizontal: bsl(30),
        paddingVertical: bsl(10),
    },
    moveIcon: {
        ...sizeImage(80, 100, { width: 20 }),
        tintColor: '#fff',
    },
    moveUpIcon: {
        transform: [
            {
                rotate: '-180deg',
            },
        ],
    },
});

export default SwipeMove;
