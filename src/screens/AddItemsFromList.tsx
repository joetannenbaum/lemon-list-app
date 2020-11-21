import React, { useState } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import { ScrollView, View, Button, TouchableOpacity } from 'react-native';
import useShoppingList from '@/hooks/useShoppingList';
import Checkbox from '@/components/Checkbox';
import BodyText from '@/components/BodyText';
import { useQueryCache, useMutation } from 'react-query';
import api from '@/api';
import { Navigation } from 'react-native-navigation';

export interface AddItemsFromListProps {
    id: number;
    addToListId: number;
}

const AddItemsFromList: Screen<AddItemsFromListProps & ScreenProps> = (
    props,
) => {
    const [selected, setSelected] = useState<number[]>([]);

    const queryCache = useQueryCache();
    const addToList = useShoppingList(props.addToListId);
    const list = useShoppingList(props.id);

    const [addItems, { status, data, error }] = useMutation(
        (ids: number[]) => {
            return api.post(
                `shopping-list-versions/${props.addToListId}/items-from-list`,
                { item_ids: ids },
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries([
                    'shopping-list',
                    props.addToListId,
                ]);
            },
        },
    );

    const allSelected =
        selected.length === list.data?.active_version?.items.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            return setSelected([]);
        }

        setSelected(list.data?.active_version?.items.map((item) => item.id));
    };

    const toggleItem = (itemId: number) => {
        setSelected((state) => {
            if (selected.includes(itemId)) {
                return state.filter((id) => id !== itemId);
            }

            return state.concat(itemId);
        });
    };

    const onAddToListPress = () => {
        addItems(selected).then(() => {
            Navigation.dismissModal(props.componentId);
        });
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 50 }}>
                <Button
                    disabled={selected.length === 0}
                    title={`Add to ${addToList.data?.name}`}
                    onPress={onAddToListPress}
                />

                <Button
                    title={allSelected ? 'Unselect All' : 'Select All'}
                    onPress={toggleSelectAll}
                />
                {list.data?.active_version?.items.map((item) => (
                    <View
                        key={item.id.toString()}
                        style={{
                            flexDirection: 'row',
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}>
                        <Checkbox
                            checked={selected.includes(item.id)}
                            onPress={() => toggleItem(item.id)}
                        />
                        <TouchableOpacity onPress={() => toggleItem(item.id)}>
                            <BodyText>{item.item.name}</BodyText>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default AddItemsFromList;
