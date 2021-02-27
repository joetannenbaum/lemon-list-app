import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BaseText from './BaseText';
import {
    View,
    TouchableOpacity,
    Button,
    Animated,
    useWindowDimensions,
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
} from '@/util/style';
import EditShoppingListItem from './EditShoppingListItem';

interface Props {
    listId: number;
    item: ShoppingListItemType;
    onEditPress: () => void;
}

const ShoppingListItem: React.FC<Props> = (props) => {
    const { width } = useWindowDimensions();

    // This is in state for purposes of optimistic updates
    const [checkedOff, setCheckedOff] = useState(props.item.checked_off);
    const [editing, setEditing] = useState(false);

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
        // setEditing(true);
        props.onEditPress();
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
        <>
            <Swipeable
                enabled={!props.dragging}
                renderRightActions={renderRightActions}>
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
        paddingTop: bsl(1),
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
