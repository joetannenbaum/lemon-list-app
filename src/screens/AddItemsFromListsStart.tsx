import React, { useState, useCallback } from 'react';
import useShoppingLists from '@/hooks/useShoppingLists';
import {
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    View,
} from 'react-native';
import BaseText from '@/components/BaseText';
import asModal from '@/components/asModal';
import AddItemsFromList from '@/components/AddItemsFromList';
import { bsl, sizeImage, grey300, grey400 } from '@/util/style';
import { Screen, ModalScreenProps } from '@/types/navigation';

export interface AddItemsFromListsStartProps {
    addToListId: number;
}

const AddItemsFromListsStart: Screen<
    AddItemsFromListsStartProps & ModalScreenProps
> = (props) => {
    const shoppingLists = useShoppingLists();
    const [listId, setListId] = useState<number | null>(null);

    const lists = shoppingLists.data?.filter(
        (list) => list.id !== props.addToListId && list.total_items > 0,
    );

    if (listId !== null) {
        return (
            <>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setListId(null)}>
                    <Image
                        source={require('@images/carat-right.png')}
                        style={styles.backCarat}
                    />
                    <BaseText color={grey400} lineHeight={34}>
                        Back
                    </BaseText>
                </TouchableOpacity>
                <AddItemsFromList
                    id={listId}
                    addToListId={props.addToListId}
                    dismiss={props.dismiss}
                />
            </>
        );
    }

    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity
                style={styles.button}
                onPress={() => setListId(item.id)}>
                <View style={styles.textWrapper}>
                    <BaseText>{item.name}</BaseText>
                </View>
                <Image
                    source={require('@images/carat-right.png')}
                    style={styles.carat}
                />
            </TouchableOpacity>
        ),
        [],
    );

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={lists}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: bsl(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    carat: sizeImage(16, 24, { width: 16 }),
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: bsl(20),
    },
    backCarat: {
        ...sizeImage(16, 24, { width: 14 }),
        transform: [
            {
                rotate: '180deg',
            },
        ],
        tintColor: grey300,
        marginRight: bsl(15),
    },
    textWrapper: {
        flex: 1,
        paddingRight: bsl(20),
    },
    divider: {
        height: bsl(3),
        backgroundColor: grey400,
        marginVertical: bsl(20),
    },
});

export default asModal(AddItemsFromListsStart);
