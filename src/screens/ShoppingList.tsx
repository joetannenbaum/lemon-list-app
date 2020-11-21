import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useShoppingList from '@/hooks/useShoppingList';
import CreateItemForm from '@/components/CreateItemForm';
import ShoppingListItem from '@/components/ShoppingListItem';
import DraggableFlatList, {
    DragEndParams,
} from 'react-native-draggable-flatlist';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import { useQueryCache, useMutation } from 'react-query';
import api from '@/api';
import { View, TouchableOpacity } from 'react-native';
import useStores from '@/hooks/useStores';
import BodyText from '@/components/BodyText';
import { ScrollView } from 'react-native-gesture-handler';
import { StoreTag } from '@/types/StoreTag';

interface Props extends ScreenProps {
    id: number;
}

interface ItemsByStoreTag {
    tag: StoreTag;
    items: ShoppingListItemType[];
}

const ShoppingList: Screen<Props> = (props) => {
    const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

    const list = useShoppingList(props.id);
    const stores = useStores();

    const [listData, setListData] = useState(
        list.data?.active_version?.items || [],
    );

    const [storeOrder, setStoreOrder] = useState<ItemsByStoreTag>([]);

    useEffect(() => {
        const orderedByStore = stores.data
            ?.find((store) => store.id === activeStoreId)
            ?.tags.map((tag) => {
                return {
                    tag,
                    items: listData.filter((item) =>
                        item.item.store_tags.find(
                            (storeTag) => storeTag.id === tag.id,
                        ),
                    ),
                };
            })
            .filter((tag) => tag.items.length > 0);

        const uncategorizedItems = listData.filter(
            (item) =>
                !item.item.store_tags.find(
                    (storeTag) => storeTag.store_id === activeStoreId,
                ),
        );

        if (uncategorizedItems.length > 0) {
            orderedByStore?.unshift({
                tag: {
                    name: 'Uncategorized',
                    id: -1,
                    store_id: -1,
                    order: -1,
                },
                items: uncategorizedItems,
            });
        }

        setStoreOrder(orderedByStore);
    }, [listData, activeStoreId]);

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
            <View style={{ padding: 20 }}>
                {stores.data?.map((store) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (store.id === activeStoreId) {
                                setActiveStoreId(null);
                            } else {
                                setActiveStoreId(store.id);
                            }
                        }}>
                        <BodyText bold={store.id === activeStoreId}>
                            {store.name}
                        </BodyText>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ zIndex: 100 }}>
                <CreateItemForm listId={props.id} />
            </View>
            <ScrollView style={{ flex: 1 }}>
                {activeStoreId &&
                    storeOrder?.map((section) => (
                        <View key={section.tag.id.toString()}>
                            <BodyText bold={true}>{section.tag.name}</BodyText>
                            {section.items.map((item) => (
                                <ShoppingListItem
                                    listId={props.id}
                                    item={item}
                                    key={item.id.toString()}
                                    // drag={drag}
                                    // isActive={isActive}
                                />
                            ))}
                        </View>
                    ))}
                {!activeStoreId &&
                    listData.map((item) => (
                        <ShoppingListItem
                            listId={props.id}
                            item={item}
                            key={item.id.toString()}
                            // drag={drag}
                            // isActive={isActive}
                        />
                    ))}
                {/* <DraggableFlatList
                    scrollEnabled={false}
                    style={{ flex: 1 }}
                    data={listData}
                    keyExtractor={(item) => item.id.toString()}
                    onDragEnd={onDragEnd}
                    renderItem={({ item, drag, isActive }) => (
                        <ShoppingListItem
                            listId={props.id}
                            item={item}
                            key={item.id.toString()}
                            drag={drag}
                            isActive={isActive}
                        />
                    )}
                /> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ShoppingList;
