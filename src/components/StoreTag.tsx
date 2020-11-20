import React from 'react';
import BodyText from './BodyText';
import { View, TouchableOpacity, Button } from 'react-native';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';
import SwipeableItem from 'react-native-swipeable-item';
import { StoreTag as StoreTagType } from '@/types/StoreTag';

interface Props {
    item: StoreTagType;
    drag: () => void;
    isActive: boolean;
}

const StoreTag: React.FC<Props> = (props) => {
    const queryCache = useQueryCache();

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
                queryCache.invalidateQueries(['stores', props.item.store_id]);
            },
        },
    );

    const renderDelete = () => {
        return (
            <View
                style={{
                    backgroundColor: 'red',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                }}>
                <Button
                    color="white"
                    title="Delete"
                    onPress={() => {
                        deleteItem();
                    }}
                />
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <SwipeableItem
                renderUnderlayLeft={renderDelete}
                snapPointsLeft={[100]}>
                <View
                    style={[
                        {
                            padding: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: '#fff',
                        },
                        props.isActive
                            ? {
                                  shadowColor: '#9B9B9B',
                                  shadowOffset: { width: 3, height: 3 },
                                  shadowOpacity: 0.25,
                                  shadowRadius: 10,
                              }
                            : null,
                    ]}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onLongPress={props.drag}>
                        <BodyText>{props.item.name}</BodyText>
                    </TouchableOpacity>
                </View>
            </SwipeableItem>
        </View>
    );
};

export default StoreTag;
