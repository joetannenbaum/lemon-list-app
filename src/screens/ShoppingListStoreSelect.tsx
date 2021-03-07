import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import asModal from '@/components/asModal';
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

    const renderItem = useCallback(
        ({ item }) => (
            <ArrowButton
                onPress={() => {
                    props.onSelect(item.id);
                    props.dismiss();
                }}>
                {item.name}
            </ArrowButton>
        ),
        [],
    );

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
                ItemSeparatorComponent={() => <Divider margin={20} />}
                renderItem={renderItem}
            />
        </>
    );
};

export default asModal(ShoppingListStoreSelect);
