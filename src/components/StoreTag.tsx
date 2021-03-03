import React from 'react';
import BaseText from './BaseText';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import api from '@/api';
import { useMutation, useQueryClient } from 'react-query';
import { StoreTag as StoreTagType } from '@/types/StoreTag';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeDelete from './SwipeDelete';
import SwipeMove from './SwipeMove';
import { grey200, bsl } from '@/util/style';

interface Props {
    item: StoreTagType;
    isFirst: boolean;
    isLast: boolean;
    index: number;
    onMove: (index: number, direction: number) => void;
}

const StoreTag: React.FC<Props> = (props) => {
    const queryClient = useQueryClient();

    const { mutateAsync: updateItem } = useMutation(
        (params) => {
            return api.put(
                `stores/${props.item.store_id}/tags/${props.item.id}`,
                params,
            );
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['store', props.item.store_id]);
            },
        },
    );

    const { mutateAsync: deleteItem } = useMutation(
        () => {
            return api.delete(
                `stores/${props.item.store_id}/tags/${props.item.id}`,
            );
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['store', props.item.store_id]);
            },
        },
    );

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation,
        dragX: Animated.AnimatedInterpolation,
    ) => {
        return <SwipeDelete onPress={() => deleteItem()} />;
    };

    const renderLeftActions = (
        progress: Animated.AnimatedInterpolation,
        dragX: Animated.AnimatedInterpolation,
    ) => {
        return (
            <SwipeMove
                isFirst={props.isFirst}
                isLast={props.isLast}
                onMove={(direction) => props.onMove(props.index, direction)}
            />
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}>
            <View style={styles.wrapper}>
                <View style={styles.rowContent}>
                    <BaseText>{props.item.name}</BaseText>
                </View>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        borderBottomColor: grey200,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: bsl(15),
    },
    rowContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        padding: bsl(20),
    },
});

export default StoreTag;
