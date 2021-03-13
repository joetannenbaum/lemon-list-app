import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import useShoppingList from '@/hooks/useShoppingList';
import Checkbox from '@/components/Checkbox';
import BaseText from '@/components/BaseText';
import { useQueryClient, useMutation } from 'react-query';
import api from '@/api';
import { bsl } from '@/util/style';
import SubmitButton from './form/SubmitButton';
import Divider from './Divider';

export interface AddItemsFromListProps {
    id: number;
    addToListId: number;
    dismiss: () => void;
}

const AddItemsFromList: React.FC<AddItemsFromListProps> = (props) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const queryClient = useQueryClient();
    const addToList = useShoppingList(props.addToListId);
    const list = useShoppingList(props.id);

    const { mutateAsync: addItems, status, data, error } = useMutation(
        (ids: number[]) => {
            return api.post(
                `shopping-list-versions/${props.addToListId}/items-from-list`,
                { item_ids: ids },
            );
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([
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
        setProcessing(true);
        addItems(selected).then(props.dismiss);
    };

    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity
                onPress={() => toggleItem(item.id)}
                key={item.id.toString()}
                style={styles.row}>
                <Checkbox checked={selected.includes(item.id)} />
                <View style={styles.textWrapper}>
                    <BaseText>{item.item.name}</BaseText>
                </View>
            </TouchableOpacity>
        ),
        [selected],
    );

    return (
        <>
            <TouchableOpacity style={styles.selectAllButton}>
                <Checkbox checked={!allSelected} />
                <View style={styles.selectAllTextWrapper}>
                    <BaseText onPress={toggleSelectAll}>
                        {allSelected ? 'Unselect All' : 'Select All'}
                    </BaseText>
                </View>
            </TouchableOpacity>
            <Divider />
            <FlatList
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                data={list.data?.active_version?.items}
                renderItem={renderItem}
            />
            <View style={styles.buttonWrapper}>
                <SubmitButton
                    processing={processing}
                    disabled={selected.length === 0}
                    onPress={onAddToListPress}>
                    {`Add to ${addToList.data?.name} List`}
                </SubmitButton>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingVertical: bsl(20),
    },
    buttonWrapper: {
        paddingTop: bsl(20),
    },
    row: {
        flexDirection: 'row',
        paddingVertical: bsl(20),
        alignItems: 'center',
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: bsl(20),
    },
    selectAllTextWrapper: {
        paddingLeft: bsl(20),
    },
    textWrapper: {
        flex: 1,
        paddingLeft: bsl(20),
    },
});

export default AddItemsFromList;
