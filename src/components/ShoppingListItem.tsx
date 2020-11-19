import React, { useState, useCallback } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BodyText from './BodyText';
import { View, TouchableOpacity } from 'react-native';
import debounce from 'lodash/debounce';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';

interface Props {
    item: ShoppingListItemType;
}

const ShoppingListItem: React.FC<Props> = (props) => {
    const [quantity, setQuantity] = useState(props.item.quantity);

    const queryCache = useQueryCache();

    const [mutate, { status, data, error }] = useMutation(
        (params) => {
            return api.put(
                `shopping-list-versions/${props.item.shopping_list_version_id}/items/${props.item.id}`,
                params,
            );
        },
        {
            onSuccess() {
                // queryCache.invalidateQueries(['shopping-list', props.listId]);
            },
        },
    );

    const updateViaApi = (newQuantity: number) => {
        mutate({
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

    return (
        <View
            style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
            <BodyText>{props.item.item.name}</BodyText>
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
    );
};

export default ShoppingListItem;
