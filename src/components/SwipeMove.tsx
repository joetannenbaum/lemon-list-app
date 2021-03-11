import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { sizeImage, bsl, blue400 } from '@/util/style';
import { MoveDirection } from '@/util';

export interface SwipeMoveProps {
    onMove: (direction: MoveDirection) => void;
    isFirst: boolean;
    isLast: boolean;
}

const SwipeMove: React.FC<SwipeMoveProps> = (props) => {
    const alertMoveToTop = () => {
        Alert.alert('Move to top?', undefined, [
            {
                text: 'Yes',
                onPress() {
                    props.onMove(-2);
                },
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    };

    const alertMoveToBottom = () => {
        Alert.alert('Move to bottom?', undefined, [
            {
                text: 'Yes',
                onPress() {
                    props.onMove(2);
                },
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    };

    return (
        <View style={styles.moveWrapper}>
            {!props.isFirst && (
                <TouchableOpacity
                    style={styles.moveButton}
                    onPress={() => props.onMove(-1)}
                    onLongPress={alertMoveToTop}>
                    <Image
                        source={require('@images/arrow-down.png')}
                        style={[styles.moveIcon, styles.moveUpIcon]}
                    />
                </TouchableOpacity>
            )}
            {!props.isLast && (
                <TouchableOpacity
                    style={styles.moveButton}
                    onPress={() => props.onMove(1)}
                    onLongPress={alertMoveToBottom}>
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
