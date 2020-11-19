import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useShoppingList from '@/hooks/useShoppingList';
import useItems from '@/hooks/useItems';
import CreateItemForm from '@/components/CreateItemForm';
import ShoppingListItem from '@/components/ShoppingListItem';
import DraggableFlatList, {
    DragEndParams,
} from 'react-native-draggable-flatlist';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import { useQueryCache, useMutation } from 'react-query';
import api from '@/api';

interface Props extends ScreenProps {
    id: number;
}

// https://reactnative.dev/docs/sectionlist

const ShoppingList: Screen<Props> = (props) => {
    const list = useShoppingList(props.id);
    const items = useItems();

    const [listData, setListData] = useState(
        list.data?.active_version?.items || [],
    );

    useEffect(() => {
        setListData(list.data?.active_version?.items || []);
    }, [list.data]);

    const queryCache = useQueryCache();

    const [mutate, { status, data, error }] = useMutation(
        (params) => {
            return api.put(
                `shopping-list-versions/${list.data?.active_version?.id}/reorder-items`,
                params,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['shopping-list', props.id]);
            },
        },
    );

    const onDragEnd = ({ data }: DragEndParams<ShoppingListItemType>) => {
        setListData(data);

        mutate({
            order: data.map((item) => item.id),
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CreateItemForm listId={props.id} />
            <DraggableFlatList
                style={{ flex: 1 }}
                data={listData}
                keyExtractor={(item) => item.id.toString()}
                onDragEnd={onDragEnd}
                renderItem={({ item, drag, isActive }) => (
                    <ShoppingListItem
                        item={item}
                        key={item.id.toString()}
                        drag={drag}
                        isActive={isActive}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default ShoppingList;
