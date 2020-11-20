import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BodyText from './BodyText';
import { View, TouchableOpacity, Button } from 'react-native';
import debounce from 'lodash/debounce';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';
import SwipeableItem from 'react-native-swipeable-item';

interface Props {
    listId: number;
    item: ShoppingListItemType;
    drag: () => void;
    isActive: boolean;
}

const ShoppingListItem: React.FC<Props> = (props) => {
    const [quantity, setQuantity] = useState(props.item.quantity);

    useEffect(() => {
        setQuantity(props.item.quantity);
    }, [props.item.quantity]);

    const queryCache = useQueryCache();

    const [updateItem] = useMutation(
        (params) => {
            return api.put(
                `shopping-list-versions/${props.item.shopping_list_version_id}/items/${props.item.id}`,
                params,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['shopping-list', props.listId]);
            },
        },
    );

    const [deleteItem] = useMutation(
        () => {
            return api.delete(
                `shopping-list-versions/${props.item.shopping_list_version_id}/items/${props.item.id}`,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['shopping-list', props.listId]);
            },
        },
    );

    const updateViaApi = (newQuantity: number) => {
        updateItem({
            quantity: newQuantity,
        });
    };

    const debouncedUpdate = useCallback(
        debounce((newQuantity) => updateViaApi(newQuantity), 750),
        [],
    );

    const increaseQuantity = () => changeQuantity(1);
    const decreaseQuantity = () => changeQuantity(-1);

    const changeQuantity = (by: number) => {
        setQuantity((state) => {
            const newState = Math.max(1, state + by);
            debouncedUpdate(newState);
            return newState;
        });
    };

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
                        <BodyText>{props.item.item.name}</BodyText>
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <TouchableOpacity onPress={decreaseQuantity}>
                            <BodyText>-</BodyText>
                        </TouchableOpacity>
                        <BodyText>{quantity}</BodyText>
                        <TouchableOpacity onPress={increaseQuantity}>
                            <BodyText>+</BodyText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SwipeableItem>
        </View>
    );
};

export default ShoppingListItem;
