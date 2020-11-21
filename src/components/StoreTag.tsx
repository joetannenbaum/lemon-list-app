import React from 'react';
import BodyText from './BodyText';
import {
    View,
    TouchableOpacity,
    Button,
    Animated,
    useWindowDimensions,
} from 'react-native';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';
import { StoreTag as StoreTagType } from '@/types/StoreTag';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SortHandle from './SortHandle';

interface Props {
    item: StoreTagType;
    dragging: boolean;
}

const StoreTag: React.FC<Props> = (props) => {
    const queryCache = useQueryCache();
    const { width } = useWindowDimensions();

    const [updateItem] = useMutation(
        (params) => {
            return api.put(
                `stores/${props.item.store_id}/tags/${props.item.id}`,
                params,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['store', props.item.store_id]);
            },
        },
    );

    const [deleteItem] = useMutation(
        () => {
            return api.delete(
                `stores/${props.item.store_id}/tags/${props.item.id}`,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['store', props.item.store_id]);
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
                        <BodyText>{props.item.name}</BodyText>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        </View>
    );
};

export default StoreTag;
