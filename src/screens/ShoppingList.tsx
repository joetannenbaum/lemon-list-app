import React, { useState, useEffect, useMemo } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useShoppingList from '@/hooks/useShoppingList';
import CreateItemForm from '@/components/CreateItemForm';
import ShoppingListItem from '@/components/ShoppingListItem';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import { useQueryCache, useMutation } from 'react-query';
import api from '@/api';
import { View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import useStores from '@/hooks/useStores';
import BodyText from '@/components/BodyText';
import { StoreTag } from '@/types/StoreTag';
import SortableList from '@/components/SortableList';
import { Store } from '@/types/Store';

interface Props extends ScreenProps {
    id: number;
}

interface ItemsByStoreTag {
    tag: StoreTag;
    items: ShoppingListItemType[];
}

const ShoppingList: Screen<Props> = (props) => {
    const list = useShoppingList(props.id);
    const stores = useStores();

    const [listData, setListData] = useState(
        list.data?.active_version?.items || [],
    );
    const [activeStoreId, setActiveStoreId] = useState<number | null>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const storeOrder = useMemo<{
        [key: number]: ItemsByStoreTag;
    }>(() => {
        return stores.data?.reduce((prev, current: Store) => {
            const orderedByStore = current?.tags
                .map((tag) => {
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
                        (storeTag) => storeTag.store_id === current.id,
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

            return {
                ...prev,
                [current.id]: orderedByStore,
            };
        }, {});
    }, [listData]);

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

    const onListUpdate = (data) => {
        mutate({
            order: data.map((item) => item.id),
        });
    };

    const renderShoppingListItem = (
        item: ShoppingListItemType,
        index: number,
        dragging: boolean,
    ) => {
        return (
            <ShoppingListItem
                listId={props.id}
                item={item}
                key={item.id.toString()}
                dragging={dragging}
            />
        );
    };

    const onDragEnd = () => {
        setScrollEnabled(true);
    };

    const onDragStart = () => {
        setScrollEnabled(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                {stores.data?.map((store) => (
                    <TouchableOpacity
                        key={store.id.toString()}
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
            <ScrollView style={{ flex: 1 }} scrollEnabled={scrollEnabled}>
                {activeStoreId ? (
                    storeOrder[activeStoreId]?.map(
                        (section: ItemsByStoreTag) => (
                            <View key={section.tag.id.toString()}>
                                <BodyText bold={true}>
                                    {section.tag.name}
                                </BodyText>
                                <SortableList
                                    data={section.items}
                                    onUpdate={onListUpdate}
                                    renderItem={renderShoppingListItem}
                                    disableScroll={true}
                                    onDragEnd={onDragEnd}
                                    onDragStart={onDragStart}
                                />
                            </View>
                        ),
                    )
                ) : (
                    <SortableList
                        data={listData}
                        onUpdate={onListUpdate}
                        renderItem={renderShoppingListItem}
                        disableScroll={true}
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ShoppingList;
