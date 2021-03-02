import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import useShoppingList from '@/hooks/useShoppingList';
import CreateItemForm from '@/components/CreateItemForm';
import ShoppingListItem from '@/components/ShoppingListItem';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import { useQueryClient, useMutation } from 'react-query';
import api from '@/api';
import {
    View,
    TouchableOpacity,
    Button,
    Alert,
    StyleSheet,
    Image,
    SectionList,
} from 'react-native';
import useStores from '@/hooks/useStores';
import { StoreTag } from '@/types/StoreTag';
import { Store } from '@/types/Store';
import { Navigation } from 'react-native-navigation';
import { showPopup } from '@/util/navigation';
import useShoppingLists from '@/hooks/useShoppingLists';
import Pusher from 'pusher-js/react-native';
import useMe from '@/hooks/useMe';
import Config from 'react-native-config';
import Wrapper from '@/components/Wrapper';
import BaseText from '@/components/BaseText';
import {
    flexCenter,
    getColorFromString,
    bsl,
    centeredRow,
    sizeImage,
    yellow100,
    grey100,
} from '@/util/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import Divider from '@/components/Divider';
import MenuButton from '@/components/MenuButton';
import { move } from 'formik';
import debounce from 'lodash/debounce';
import ShoppingListToolButton from '@/components/ShoppingListToolButton';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';

export interface ShoppingListProps {
    id: number;
}

interface ItemsByStoreTag {
    tag: StoreTag;
    data: ShoppingListItemType[];
}

const ShoppingList: Screen<ShoppingListProps & ScreenProps> = (props) => {
    const queryClient = useQueryClient();

    const me = useMe();

    const shoppingLists = useShoppingLists();
    const list = useShoppingList(props.id);
    const stores = useStores();

    const inset = useSafeAreaInsets();

    const listColor = getColorFromString(list.data?.name);

    const [listData, setListData] = useState(
        list.data?.active_version?.items || [],
    );
    const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

    const canAddFromOtherLists =
        shoppingLists.data?.filter(
            (list) => list.id !== props.id && list.total_items > 0,
        ).length > 0;

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
                queryClient.invalidateQueries(['shopping-list', props.id]);

                if (data.name !== list.data?.name) {
                    queryClient.invalidateQueries('shopping-lists');
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
                        data: listData.filter(
                            (item) =>
                                typeof item.item.store_tags.find(
                                    (storeTag) => storeTag.id === tag.id,
                                ) !== 'undefined',
                        ),
                    };
                })
                .filter((tag) => tag.data.length > 0);

            const uncategorizedItems = listData.filter(
                (item) =>
                    typeof item.item.store_tags.find(
                        (storeTag) => storeTag.store_id === current.id,
                    ) === 'undefined',
            );

            if (uncategorizedItems.length > 0) {
                orderedByStore?.unshift({
                    tag: {
                        name: 'Uncategorized',
                        id: -1,
                        store_id: -1,
                        order: -1,
                    },
                    data: uncategorizedItems,
                });
            }

            return {
                ...prev,
                [current.id]: orderedByStore,
            };
        }, {});
    }, [listData, stores]);

    useEffect(() => {
        setListData(list.data?.active_version?.items || []);

        if (list.data === null) {
            queryClient.invalidateQueries('shopping-lists');
        }
    }, [list.data]);

    const { mutateAsync: reorder } = useMutation(
        (params) => {
            return api.put(
                `shopping-list-versions/${list.data?.active_version?.id}/reorder-items`,
                params,
            );
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['shopping-list', props.id]);
            },
        },
    );

    const { mutateAsync: deleteList } = useMutation(
        () => {
            return api.delete(`shopping-lists/${list.data?.id}`);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('shopping-lists');
            },
        },
    );

    const { mutateAsync: clearComplete } = useMutation(
        () => {
            return api.post(`shopping-lists/${list.data?.id}/archive`);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['shopping-list', props.id]);
            },
        },
    );

    const reorderViaApi = (params: object) => reorder(params);

    const debouncedReorder = useCallback(
        debounce((params) => reorderViaApi(params), 1000),
        [],
    );

    const onItemMove = (index: number, direction: number) => {
        setListData((state) => {
            const newState = move(state, index, index + direction);

            debouncedReorder({
                order: newState.map((item) => item.id),
            });

            return newState;
        });
    };

    // TODO: Fix the isLast property for sectioned data
    const renderShoppingListItem = useCallback(
        ({ item, index }: { item: ShoppingListItemType; index: number }) => (
            <ShoppingListItem
                listId={props.id}
                item={item}
                isFirst={index === 0}
                isLast={index === listData.length - 1}
                index={index}
                key={item.id.toString()}
                onMove={onItemMove}
            />
        ),
        [],
    );

    const shoppingListKeyExtractor = useCallback(
        (item) => item.id.toString(),
        [],
    );

    const deleteShoppingList = () => {
        deleteList().then(() => {
            Navigation.pop(props.componentId);
        });
    };

    const clearCompletedItems = () => {
        clearComplete();
    };

    const onClearCompletedItemPress = () => {
        return Alert.alert(
            'Clear completed items?',
            'This will remove all completed items from the list',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Clear Items',
                    style: 'destructive',
                    onPress: clearCompletedItems,
                },
            ],
        );
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

    if (list.isFetched && list.data === null) {
        return (
            <Wrapper>
                <View style={{ padding: 20 }}>
                    <BaseText>List not found.</BaseText>
                    <BaseText>This list looks like it's missing.</BaseText>
                    <Button
                        title="Back to Home"
                        onPress={() => {
                            Navigation.pop(props.componentId);
                        }}
                    />
                </View>
            </Wrapper>
        );
    }

    if (!list.isFetched) {
        return <Loading />;
    }

    return (
        <Wrapper
            style={{ backgroundColor: '#fff' }}
            forceInset={{ top: 'never', bottom: 'never' }}>
            <View
                style={[
                    styles.headerWrapper,
                    {
                        paddingTop: inset.top,
                        backgroundColor: listColor,
                    },
                ]}>
                <View
                    style={{
                        position: 'absolute',
                        left: bsl(20),
                        top: bsl(20) + inset.top,
                    }}>
                    <MenuButton />
                </View>
                <View style={styles.header}>
                    <BaseText size={50}>{list.data?.name}</BaseText>
                </View>
            </View>

            <View>
                <TouchableOpacity
                    style={styles.changeStoresButton}
                    onPress={() =>
                        showPopup('ShoppingListStoreSelect', {
                            onSelect: (storeId: number | null) => {
                                setActiveStoreId(storeId);
                            },
                        })
                    }>
                    <Image
                        style={styles.changeStoresIcon}
                        source={require('@images/shopping-cart.png')}
                    />
                    <BaseText>
                        {stores.data?.find(
                            (store) => store.id === activeStoreId,
                        )?.name || 'Select Store'}
                    </BaseText>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                {listData.length === 0 && (
                    <EmptyState subtitle="Add the first item to your list below!" />
                )}

                {listData.length > 0 && activeStoreId && (
                    <SectionList
                        sections={storeOrder[activeStoreId]}
                        renderItem={renderShoppingListItem}
                        renderSectionHeader={({ section }) => (
                            <>
                                <Divider />
                                <View style={styles.sectionHeader}>
                                    <BaseText bold={true}>
                                        {section.tag.name}
                                    </BaseText>
                                </View>
                                <Divider />
                            </>
                        )}
                        stickySectionHeadersEnabled={false}
                    />
                )}

                {listData.length > 0 && !activeStoreId && (
                    <FlatList
                        data={listData}
                        keyExtractor={shoppingListKeyExtractor}
                        renderItem={renderShoppingListItem}
                    />
                )}
            </View>
            <View style={styles.footer}>
                <View
                    style={{
                        backgroundColor: listColor,
                        paddingBottom: inset.bottom,
                    }}>
                    <View style={styles.addFormWrapper}>
                        <CreateItemForm listId={props.id} />
                    </View>

                    <View style={styles.toolsWrapper}>
                        <ShoppingListToolButton
                            onPress={() =>
                                showPopup('ShareShoppingList', {
                                    id: list.data?.id,
                                })
                            }
                            icon={require('@images/share.png')}
                            iconWidth={68}>
                            Share
                        </ShoppingListToolButton>

                        {canAddFromOtherLists && (
                            <ShoppingListToolButton
                                onPress={() =>
                                    showPopup('AddItemsFromListsStart', {
                                        addToListId: props.id,
                                    })
                                }
                                icon={require('@images/collection.png')}
                                iconWidth={68}>
                                Import
                            </ShoppingListToolButton>
                        )}

                        <ShoppingListToolButton
                            onPress={onClearCompletedItemPress}
                            icon={require('@images/badge-check.png')}
                            iconWidth={68}>
                            Clear
                        </ShoppingListToolButton>

                        {list.data?.is_owner && (
                            <ShoppingListToolButton
                                onPress={() =>
                                    showPopup('EditShoppingList', {
                                        id: props.id,
                                    })
                                }
                                icon={require('@images/pencil.png')}
                                iconWidth={78}
                                iconHeight={79}>
                                Edit
                            </ShoppingListToolButton>
                        )}

                        {list.data?.is_owner && (
                            <ShoppingListToolButton
                                onPress={onDeleteShoppingListPress}
                                icon={require('@images/trash.png')}
                                iconWidth={61}
                                iconHeight={68}>
                                Delete
                            </ShoppingListToolButton>
                        )}

                        {!list.data?.is_owner && (
                            <ShoppingListToolButton
                                onPress={onDeleteShoppingListPress}
                                icon={require('@images/leave.png')}
                                iconWidth={68}
                                iconHeight={61}>
                                Leave
                            </ShoppingListToolButton>
                        )}
                    </View>
                </View>
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        ...flexCenter,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: bsl(1),
        },
        shadowRadius: bsl(3),
        shadowOpacity: 0.1,
        zIndex: 50,
    },
    header: {
        paddingHorizontal: bsl(20),
        paddingVertical: bsl(30),
    },
    sectionHeader: {
        paddingHorizontal: bsl(20),
        paddingVertical: bsl(20),
        backgroundColor: grey100,
    },
    listScrollView: {
        flex: 1,
    },
    addFormWrapper: {
        zIndex: 100,
        paddingBottom: bsl(20),
        paddingTop: bsl(40),
    },
    listScrollViewContent: {
        padding: bsl(20),
    },
    headerUnderline: {
        height: bsl(10),
    },
    toolsWrapper: {
        ...centeredRow,
        paddingHorizontal: bsl(40),
        paddingVertical: bsl(20),
        justifyContent: 'space-between',
    },
    changeStoresButton: {
        backgroundColor: yellow100,
        paddingHorizontal: bsl(20),
        paddingVertical: bsl(20),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeStoresIcon: {
        ...sizeImage(78, 78, {
            height: 30,
        }),
        marginRight: bsl(10),
    },
});

export default ShoppingList;
