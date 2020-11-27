import React, { useState, useEffect, useMemo } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useShoppingList from '@/hooks/useShoppingList';
import CreateItemForm from '@/components/CreateItemForm';
import ShoppingListItem from '@/components/ShoppingListItem';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import { useQueryCache, useMutation } from 'react-query';
import api from '@/api';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Button,
    Alert,
} from 'react-native';
import useStores from '@/hooks/useStores';
import BodyText from '@/components/BodyText';
import { StoreTag } from '@/types/StoreTag';
import SortableList from '@/components/SortableList';
import { Store } from '@/types/Store';
import { Navigation } from 'react-native-navigation';
import { screenComponent } from '@/util/navigation';
import { AddItemsFromListsStartProps } from './AddItemsFromListsStart';
import useShoppingLists from '@/hooks/useShoppingLists';
import { ShareShoppingListProps } from './ShareShoppingList';
import Pusher from 'pusher-js/react-native';
import useMe from '@/hooks/useMe';
import Config from 'react-native-config';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { EditShoppingListProps } from './EditShoppingList';

export interface ShoppingListProps {
    id: number;
}

interface ItemsByStoreTag {
    tag: StoreTag;
    items: ShoppingListItemType[];
}

const ShoppingList: Screen<ShoppingListProps & ScreenProps> = (props) => {
    const queryCache = useQueryCache();

    const me = useMe();

    const shoppingLists = useShoppingLists();
    const list = useShoppingList(props.id);
    const stores = useStores();

    const [listData, setListData] = useState(
        list.data?.active_version?.items || [],
    );
    const [activeStoreId, setActiveStoreId] = useState<number | null>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    useNavigationButtonPress(
        (e) => {
            Navigation.showModal(
                screenComponent<EditShoppingListProps>('EditShoppingList', {
                    passProps: {
                        id: list.data?.id,
                    },
                }),
            );
        },
        { buttonId: 'edit-shopping-list', componentId: props.componentId },
    );

    useEffect(() => {
        if (!list.data?.is_shared) {
            // No need to fire up pushed if it's not a shared list
            return;
        }

        Pusher.logToConsole = Config.ENVIRONMENT === 'local';

        const pusher = new Pusher(Config.PUSHER_APP_KEY, {
            cluster: 'us2',
        });

        const channel = pusher.subscribe(`shopping-list-${props.id}`);

        channel.bind('App\\Events\\ShoppingListUpdated', function (data) {
            if (me.data?.id !== data.user.id) {
                // If I am the one that made the change, we don't need to invalidate the query,
                // it'll happen anyway from the mutate
                queryCache.invalidateQueries(['shopping-list', props.id]);

                if (data.name !== list.data?.name) {
                    queryCache.invalidateQueries('shopping-lists');
                }
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, [list.data?.is_shared]);

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

        if (list.data === null) {
            queryCache.invalidateQueries('shopping-lists');
        } else {
            Navigation.mergeOptions(props.componentId, {
                topBar: {
                    title: {
                        text: list.data?.name,
                    },
                },
            });
        }

        if (list.data?.is_owner) {
            Navigation.mergeOptions(props.componentId, {
                topBar: {
                    rightButtons: [
                        {
                            text: 'Edit',
                            id: 'edit-shopping-list',
                        },
                    ],
                },
            });
        }
    }, [list.data]);

    const [reorder] = useMutation(
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

    const [deleteList] = useMutation(
        () => {
            return api.delete(`shopping-lists/${list.data?.id}`);
        },
        {
            onSuccess() {
                queryCache.invalidateQueries('shopping-lists');
            },
        },
    );

    const onListUpdate = (data) => {
        reorder({
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

    const onAddFromOtherListsPress = () => {
        Navigation.showModal({
            stack: {
                children: [
                    screenComponent<AddItemsFromListsStartProps>(
                        'AddItemsFromListsStart',
                        {
                            passProps: {
                                addToListId: props.id,
                            },
                        },
                    ),
                ],
            },
        });
    };

    const deleteShoppingList = () => {
        deleteList().then(() => {
            Navigation.pop(props.componentId);
        });
    };

    const onDeleteShoppingListPress = () => {
        if (!list.data?.is_shared) {
            return Alert.alert(
                `Delete ${list.data?.name}?`,
                'You cannot undo this action.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: deleteShoppingList,
                    },
                ],
            );
        }

        if (list.data?.is_owner) {
            return Alert.alert(
                `Delete ${list.data?.name}?`,
                "This will delete it for you and anyone you've shared the list with.",
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: deleteShoppingList,
                    },
                ],
            );
        }

        Alert.alert(
            `Leave ${list.data?.name}?`,
            'If you leave this list you will have to re-add it again to gain access later.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: deleteShoppingList,
                },
            ],
        );
    };

    if (list.data === null) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ padding: 20 }}>
                    <BodyText>List not found.</BodyText>
                    <BodyText>This list looks like it's missing.</BodyText>
                    <Button
                        title="Back to Home"
                        onPress={() => {
                            Navigation.pop(props.componentId);
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }

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
                {shoppingLists.data?.length > 0 && (
                    <Button
                        title="Add from other lists"
                        onPress={onAddFromOtherListsPress}
                    />
                )}
                <Button
                    title="Share List"
                    onPress={() => {
                        Navigation.showModal(
                            screenComponent<ShareShoppingListProps>(
                                'ShareShoppingList',
                                {
                                    passProps: {
                                        id: list.data?.id,
                                    },
                                },
                            ),
                        );
                    }}
                />
                <Button
                    title={list.data?.is_owner ? 'Delete List' : 'Leave List'}
                    onPress={onDeleteShoppingListPress}
                    color="#f00"
                />
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
