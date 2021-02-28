import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BaseText from './BaseText';
import {
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Image,
} from 'react-native';
import debounce from 'lodash/debounce';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SortHandle from './SortHandle';
import Checkbox from './Checkbox';
import ShoppingListItemQuantityControl from './ShoppingListItemQuantityControl';
import {
    centeredRow,
    bsl,
    grey200,
    grey300,
    sizeImage,
    grey500,
    red400,
    blue400,
} from '@/util/style';
import { showPopup } from '@/util/navigation';

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
        return (
            <View style={styles.deleteWrapper}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem()}>
                    <Image
                        source={require('@images/trash.png')}
                        style={styles.trashIcon}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const renderLeftActions = (
        progress: Animated.AnimatedInterpolation,
        dragX: Animated.AnimatedInterpolation,
    ) => {
        return (
            <View style={styles.moveWrapper}>
                {!props.isFirst && (
                    <TouchableOpacity
                        style={styles.moveButton}
                        onPress={() => props.onMove(props.index, -1)}>
                        <Image
                            source={require('@images/carat-right.png')}
                            style={[styles.moveIcon, styles.moveUpIcon]}
                        />
                    </TouchableOpacity>
                )}
                {!props.isLast && (
                    <TouchableOpacity
                        style={styles.moveButton}
                        onPress={() => props.onMove(props.index, 1)}>
                        <Image
                            source={require('@images/carat-right.png')}
                            style={[styles.moveIcon, styles.moveDownIcon]}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <>
            <Swipeable
                enabled={!props.dragging}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}>
                <View style={styles.wrapper}>
                    <SortHandle />
                    <View style={styles.rowContent}>
                        <View style={styles.checkboxWrapper}>
                            <Checkbox
                                checked={checkedOff}
                                onPress={toggleCheck}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.itemButton}
                            onPress={showEditModal}>
                            <BaseText
                                style={
                                    checkedOff
                                        ? styles.checkedOffText
                                        : styles.itemText
                                }>
                                {props.item.item.name}
                            </BaseText>
                            {props.item.note !== null && (
                                <View style={styles.noteWrapper}>
                                    <Image
                                        source={require('@images/word-bubble.png')}
                                        style={styles.noteIcon}
                                    />
                                    <BaseText color={grey500}>
                                        {props.item.note}
                                    </BaseText>
                                </View>
                            )}
                        </TouchableOpacity>
                        <ShoppingListItemQuantityControl
                            quantity={props.item.quantity}
                            onChange={onQuantityChange}
                        />
                    </View>
                </View>
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
    moveWrapper: {
        backgroundColor: blue400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteWrapper: {
        backgroundColor: red400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        paddingHorizontal: bsl(30),
    },
    moveButton: {
        paddingHorizontal: bsl(30),
        paddingVertical: bsl(5),
    },
    moveIcon: {
        ...sizeImage(16, 24, { width: 20 }),
        tintColor: '#fff',
    },
    moveUpIcon: {
        transform: [
            {
                rotate: '-90deg',
            },
        ],
    },
    moveDownIcon: {
        transform: [
            {
                rotate: '90deg',
            },
        ],
    },
    trashIcon: {
        ...sizeImage(61, 68, { width: 40 }),
        tintColor: '#fff',
    },
});

export default ShoppingListItem;
