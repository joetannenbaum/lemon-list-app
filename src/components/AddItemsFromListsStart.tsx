import React, { useState } from 'react';
import useShoppingLists from '@/hooks/useShoppingLists';
import {
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    View,
} from 'react-native';
import BaseText from '@/components/BaseText';
import asModal, { asModalExportedProps, asModalProps } from './asModal';
import CancelButton from './form/CancelButton';
import AddItemsFromList from '@/components/AddItemsFromList';
import { bsl, sizeImage, grey300, grey400 } from '@/util/style';

export interface AddItemsFromListsStartProps {
    addToListId: number;
}

const AddItemsFromListsStart: React.FC<
    AddItemsFromListsStartProps & asModalExportedProps & asModalProps
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
                <CancelButton onPress={props.dismiss} />
            </>
        );
    }

    return (
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={lists}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                renderItem={({ item }) => (
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
                )}
            />
            <CancelButton onPress={props.dismiss} />
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: bsl(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    carat: {
        ...sizeImage(16, 24, { width: 16 }),
    },
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
