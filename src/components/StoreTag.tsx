import React from 'react';
import BaseText from './BaseText';
import {
    View,
    TouchableOpacity,
    Button,
    Animated,
    useWindowDimensions,
} from 'react-native';
import api from '@/api';
import { useMutation, useQueryClient } from 'react-query';
import { StoreTag as StoreTagType } from '@/types/StoreTag';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SortHandle from './SortHandle';

interface Props {
    item: StoreTagType;
    dragging: boolean;
}

const StoreTag: React.FC<Props> = (props) => {
    const queryClient = useQueryClient();
    const { width } = useWindowDimensions();

    const { mutate: updateItem } = useMutation(
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

    const { mutate: deleteItem } = useMutation(
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
        return (
            <View
                style={{
                    backgroundColor: 'red',
                }}>
                <Button
                    color="white"
                    title="Delete"
                    onPress={() => deleteItem()}
                />
            </View>
        );
    };

    return (
        <View style={{ flex: 1, width }}>
            <Swipeable
                renderRightActions={renderRightActions}
                enabled={!props.dragging}>
                <View
                    style={[
                        {
                            padding: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: '#fff',
                        },
                    ]}>
                    <SortHandle />
                    <TouchableOpacity style={{ flex: 1 }}>
                        <BaseText>{props.item.name}</BaseText>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        </View>
    );
};

export default StoreTag;
