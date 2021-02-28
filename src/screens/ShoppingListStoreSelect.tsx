import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import asModal from '@/components/asModal';
import CancelButton from '@/components/form/CancelButton';
import { bsl, sizeImage } from '@/util/style';
import Divider from '@/components/Divider';
import useStores from '@/hooks/useStores';
import ArrowButton from '@/components/ArrowButton';
import { Screen, ModalScreenProps } from '@/types/navigation';

export interface ShoppingListStoreSelectProps {
    addToListId: number;
    onSelect: (storeId: number | null) => void;
}

const ShoppingListStoreSelect: Screen<
    ShoppingListStoreSelectProps & ModalScreenProps
> = (props) => {
    const stores = useStores();

    return (
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={[
                    {
                        id: null,
                        name: 'No Store',
                    },
                ].concat(stores.data)}
                keyExtractor={(item) =>
                    item.id === null ? 'none' : item.id.toString()
                }
                ItemSeparatorComponent={() => (
                    <View style={styles.divider}>
                        <Divider />
                    </View>
                )}
                renderItem={({ item }) => (
                    <ArrowButton
                        onPress={() => {
                            props.onSelect(item.id);
                            props.dismiss();
                        }}>
                        {item.name}
                    </ArrowButton>
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
    carat: sizeImage(16, 24, { width: 16 }),
    textWrapper: {
        flex: 1,
        paddingRight: bsl(20),
    },
    divider: {
        marginVertical: bsl(20),
    },
});

export default asModal(ShoppingListStoreSelect);
