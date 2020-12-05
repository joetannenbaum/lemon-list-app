import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BodyText from './BodyText';
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
import { Navigation } from 'react-native-navigation';
import { screenComponent } from '@/util/navigation';
import { EditShoppingListItemProps } from '@/screens/EditShoppingListItem';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SortHandle from './SortHandle';
import Checkbox from './Checkbox';
import ShoppingListItemQuantityControl from './ShoppingListItemQuantityControl';
import {
    centeredRow,
    bsl,
    grey200,
    grey300,
    grey400,
    sizeImage,
} from '@/util/style';
import BaseText from './BaseText';

interface Props {
    listId: number;
    item: ShoppingListItemType;
    dragging: boolean;
}

const ShoppingListItem: React.FC<Props> = (props) => {
    const { width } = useWindowDimensions();

    // This is in state for purposes of optimistic updates
    const [checkedOff, setCheckedOff] = useState(props.item.checked_off);

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
        <View style={{ width: width - bsl(40) }}>
            <Swipeable
                enabled={!props.dragging}
                renderRightActions={renderRightActions}>
                <View style={styles.wrapper}>
                    <SortHandle />
                    <View style={styles.checkboxWrapper}>
                        <Checkbox checked={checkedOff} onPress={toggleCheck} />
                    </View>
                    <TouchableOpacity
                        style={styles.itemButton}
                        onPress={showEditModal}>
                        <BaseText
                            style={checkedOff ? styles.checkedOffText : null}>
                            {props.item.item.name}
                        </BaseText>
                        {props.item.note !== null && (
                            <View style={styles.noteWrapper}>
                                <Image
                                    source={require('@images/quote.png')}
                                    style={styles.quoteIcon}
                                />
                                <BaseText color={grey400}>
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
            </Swipeable>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        ...centeredRow,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        borderBottomColor: grey200,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    checkedOffText: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        color: grey300,
    },
    itemButton: {
        flex: 1,
        padding: bsl(20),
    },
    checkboxWrapper: {
        paddingLeft: bsl(20),
    },
    noteWrapper: {
        ...centeredRow,
        marginTop: bsl(5),
    },
    quoteIcon: {
        ...sizeImage(28, 20, { width: 18 }),
        tintColor: grey400,
        marginRight: bsl(5),
        transform: [
            {
                translateY: bsl(-10),
            },
        ],
    },
});

export default ShoppingListItem;
