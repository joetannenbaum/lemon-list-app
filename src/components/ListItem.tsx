import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Checkbox from './Checkbox';
import BaseText from './BaseText';
import ShoppingListItemQuantityControl from './ShoppingListItemQuantityControl';
import {
    grey200,
    bsl,
    grey300,
    centeredRow,
    sizeImage,
    grey500,
} from '@/util/style';

export interface ListItemProps {
    checkedOff: boolean;
    toggleCheck: () => void;
    onPress: () => void;
    name: string;
    note: string | null;
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
    disableChecked?: boolean;
}

const ListItem: React.FC<ListItemProps> = (props) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.rowContent}>
                <View style={styles.checkboxWrapper}>
                    <Checkbox
                        checked={props.checkedOff}
                        onPress={props.toggleCheck}
                    />
                </View>
                <TouchableOpacity
                    style={styles.itemButton}
                    onPress={props.onPress}>
                    <BaseText
                        style={
                            props.checkedOff && props.disableChecked === true
                                ? styles.checkedOffText
                                : styles.itemText
                        }>
                        {props.name}
                    </BaseText>
                    {props.note !== null && props.note.trim() !== '' && (
                        <View style={styles.noteWrapper}>
                            <Image
                                source={require('@images/word-bubble.png')}
                                style={[
                                    styles.noteIcon,
                                    props.checkedOff &&
                                    props.disableChecked === true
                                        ? { tintColor: grey300 }
                                        : null,
                                ]}
                            />
                            <BaseText
                                style={
                                    props.checkedOff &&
                                    props.disableChecked === true
                                        ? styles.checkedOffNote
                                        : null
                                }
                                color={grey500}>
                                {props.note}
                            </BaseText>
                        </View>
                    )}
                </TouchableOpacity>
                <ShoppingListItemQuantityControl
                    quantity={props.quantity}
                    onChange={props.onQuantityChange}
                    disabled={props.disableChecked === true && props.checkedOff}
                />
            </View>
        </View>
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
    checkedOffNote: {
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
        flexDirection: 'row',
        marginTop: bsl(20),
    },
    noteIcon: {
        ...sizeImage(75, 78, { width: 22 }),
        tintColor: grey500,
        marginRight: bsl(10),
        marginTop: bsl(9),
        transform: [
            {
                translateY: bsl(2),
            },
        ],
    },
});

export default ListItem;
