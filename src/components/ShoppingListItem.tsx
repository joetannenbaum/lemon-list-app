import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BodyText from './BodyText';
import {
    View,
    TouchableOpacity,
    Button,
    Animated,
    useWindowDimensions,
} from 'react-native';
import debounce from 'lodash/debounce';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import { Navigation } from 'react-native-navigation';
import { screenComponent } from '@/util/navigation';
import { EditShoppingListItemProps } from '@/screens/EditShoppingListItem';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SortHandle from './SortHandle';

interface Props {
    listId: number;
    item: ShoppingListItemType;
    dragging: boolean;
}

const ShoppingListItem: React.FC<Props> = (props) => {
    const { width } = useWindowDimensions();

    // This is in state for purposes of optimistic updates
    const [quantity, setQuantity] = useState(props.item.quantity);
    const [checkedOff, setCheckedOff] = useState(props.item.checked_off);

    useEffect(() => {
        setQuantity(props.item.quantity);
    }, [props.item.quantity]);

    useEffect(() => {
        setCheckedOff(props.item.checked_off);
    }, [props.item.checked_off]);

    const [updateItem] = useUpdateShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const [deleteItem] = useDeleteShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const updateViaApi = (params: object) => updateItem(params);

    const debouncedUpdate = useCallback(
        debounce((params) => updateViaApi(params), 750),
        [],
    );

    const increaseQuantity = () => changeQuantity(1);
    const decreaseQuantity = () => changeQuantity(-1);

    const changeQuantity = (by: number) => {
        setQuantity((state) => {
            const newState = Math.max(1, state + by);
            debouncedUpdate({
                quantity: newState,
            });
            return newState;
        });
    };

    const toggleCheck = () => {
        setCheckedOff((state) => {
            debouncedUpdate({
                checked_off: !state,
            });
            return !state;
        });
    };

    const showEditModal = () => {
        Navigation.showModal(
            screenComponent<EditShoppingListItemProps>('EditShoppingListItem', {
                passProps: {
                    listId: props.listId,
                    item: props.item,
                },
            }),
        );
    };

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
        <View style={{ width }}>
            <Swipeable
                enabled={!props.dragging}
                renderRightActions={renderRightActions}>
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
                    <TouchableOpacity
                        style={{
                            width: 18,
                            height: 18,
                            borderColor: 'black',
                            borderWidth: 1,
                            marginRight: 5,
                            backgroundColor: checkedOff ? 'black' : 'white',
                        }}
                        onPress={toggleCheck}></TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={showEditModal}>
                        <BodyText
                            style={
                                checkedOff
                                    ? {
                                          textDecorationLine: 'line-through',
                                          textDecorationStyle: 'solid',
                                      }
                                    : null
                            }>
                            {props.item.item.name}
                        </BodyText>
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
            </Swipeable>
        </View>
    );
};

export default ShoppingListItem;
