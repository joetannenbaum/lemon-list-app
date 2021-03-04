import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import { Animated, StyleSheet } from 'react-native';
import debounce from 'lodash/debounce';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    centeredRow,
    bsl,
    grey200,
    grey300,
    sizeImage,
    grey500,
} from '@/util/style';
import { showPopup } from '@/util/navigation';
import SwipeDelete from './SwipeDelete';
import SwipeMove from './SwipeMove';
import ListItem from './ListItem';

interface Props {
    listId: number;
    item: ShoppingListItemType;
    isFirst: boolean;
    isLast: boolean;
    index: number;
    onMove: (index: number, direction: number) => void;
}

const ShoppingListItem: React.FC<Props> = (props) => {
    // This is in state for purposes of optimistic updates
    const [checkedOff, setCheckedOff] = useState(props.item.checked_off);

    useEffect(() => {
        setCheckedOff(props.item.checked_off);
    }, [props.item.checked_off]);

    const { mutateAsync: updateItem } = useUpdateShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const { mutateAsync: deleteItem } = useDeleteShoppingListItem(
        props.listId,
        props.item.shopping_list_version_id,
        props.item.id,
    );

    const updateViaApi = (params: object) => updateItem(params);

    const debouncedUpdate = useCallback(
        debounce((params) => updateViaApi(params), 750),
        [],
    );

    const onQuantityChange = (newQuantity: number) => {
        debouncedUpdate({
            quantity: newQuantity,
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
        showPopup('EditShoppingListItem', {
            listId: props.listId,
            item: props.item,
        });
    };

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
        <>
            <Swipeable
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}>
                <ListItem
                    name={props.item.item.name}
                    note={props.item.note}
                    quantity={props.item.quantity}
                    onPress={showEditModal}
                    onQuantityChange={onQuantityChange}
                    checkedOff={checkedOff}
                    toggleCheck={toggleCheck}
                    disableChecked={true}
                />
            </Swipeable>
        </>
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
        paddingTop: bsl(20),
        marginHorizontal: bsl(20),
    },
    itemText: {
        fontSize: bsl(36),
    },
    checkedOffText: {
        fontSize: bsl(36),
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        color: grey300,
    },
    itemButton: {
        flex: 1,
        padding: bsl(20),
        paddingTop: 0,
    },
    checkboxWrapper: {
        marginRight: bsl(10),
    },
    noteWrapper: {
        ...centeredRow,
        marginTop: bsl(20),
    },
    noteIcon: {
        ...sizeImage(75, 78, { width: 22 }),
        tintColor: grey500,
        marginRight: bsl(10),
        transform: [
            {
                translateY: bsl(2),
            },
        ],
    },
});

export default ShoppingListItem;
