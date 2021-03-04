import React, { useCallback } from 'react';
import { ScreenProps, Screen } from '@/types';
import asModal from '@/components/asModal';
import { View, FlatList } from 'react-native';
import TextField from '@/components/form/TextField';
import useShoppingLists from '@/hooks/useShoppingLists';
import CancelButton from '@/components/form/CancelButton';
import Divider from '@/components/Divider';
import ArrowButton from '@/components/ArrowButton';
import { ShoppingList } from '@/types/ShoppingList';
import { ModalScreenProps } from '@/types/navigation';

export interface IncomingShareImportListProps {
    onSelect: (listId: number) => void;
    onNewName: (name: string) => void;
}

const IncomingShareImportList: Screen<
    IncomingShareImportListProps & ModalScreenProps
> = (props) => {
    const lists = useShoppingLists();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingList }) => (
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

    // TODO: Handle text field for new name

    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={lists.data}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <Divider margin={20} />}
                renderItem={renderItem}
            />

            {/* <TextField name="newNameField" /> */}

            <CancelButton onPress={props.dismiss} />
        </View>
    );
};

export default asModal(IncomingShareImportList);
