import React, { useState, useEffect, useMemo } from 'react';
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
    ScrollView,
    Button,
    Alert,
    StyleSheet,
    Image,
} from 'react-native';
import useStores from '@/hooks/useStores';
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
import Wrapper from '@/components/Wrapper';
import BaseText from '@/components/BaseText';
import {
    flexCenter,
    getColorFromString,
    bsl,
    centeredRow,
    sizeImage,
    paddingX,
    paddingY,
} from '@/util/style';
import ListWrapper from '@/components/ListWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ShoppingListProps {
    id: number;
}

interface ItemsByStoreTag {
    tag: StoreTag;
    items: ShoppingListItemType[];
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
            queryClient.invalidateQueries('shopping-lists');
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

    const onListUpdate = (data) => {
        reorder({
            order: data.map((item) => item.id),
        });
    };

    const renderShoppingListItem = (
        item: ShoppingListItemType,
        index: number,
        dragging: boolean,
    ) => (
        <ShoppingListItem
            listId={props.id}
            item={item}
            key={item.id.toString()}
            dragging={dragging}
        />
    );

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

    if (list.data === null) {
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

    return (
        <Wrapper forceInset={{ top: 'never', bottom: 'never' }}>
            {/* <Button
                title="Back"
                onPress={() => {
                    Navigation.pop(props.componentId);
                }}
            /> */}
            <View
                style={[
                    styles.headerWrapper,
                    {
                        paddingTop: inset.top,
                        backgroundColor: listColor,
                    },
                ]}>
                <View style={styles.header}>
                    <BaseText size={50}>{list.data?.name}</BaseText>
                </View>
            </View>

            {/* <View style={{ padding: 20 }}>
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
                        <BaseText bold={store.id === activeStoreId}>
                            {store.name}
                        </BaseText>
                    </TouchableOpacity>
                ))}
            </View> */}

            <View style={styles.footerBg}>
                <Image
                    source={require('@images/food-footer.png')}
                    style={styles.footerImage}
                />
            </View>

            <ScrollView
                style={styles.listScrollView}
                contentContainerStyle={styles.listScrollViewContent}
                scrollEnabled={scrollEnabled}>
                {activeStoreId ? (
                    storeOrder[activeStoreId]?.map(
                        (section: ItemsByStoreTag) => (
                            <View key={section.tag.id.toString()}>
                                <BaseText bold={true}>
                                    {section.tag.name}
                                </BaseText>

                                <ListWrapper>
                                    <SortableList
                                        data={section.items}
                                        onUpdate={onListUpdate}
                                        renderItem={renderShoppingListItem}
                                        disableScroll={true}
                                        onDragEnd={onDragEnd}
                                        onDragStart={onDragStart}
                                    />
                                </ListWrapper>
                            </View>
                        ),
                    )
                ) : (
                    <ListWrapper>
                        <SortableList
                            data={listData}
                            onUpdate={onListUpdate}
                            renderItem={renderShoppingListItem}
                            disableScroll={true}
                            onDragEnd={onDragEnd}
                            onDragStart={onDragStart}
                        />
                    </ListWrapper>
                )}
            </ScrollView>
            <View style={styles.footer}>
                <Image
                    source={require('@images/paper-bag-top.png')}
                    style={[
                        styles.paperBagTopImage,
                        {
                            tintColor: listColor,
                        },
                    ]}
                />
                <View
                    style={{
                        backgroundColor: listColor,
                        paddingBottom: inset.bottom,
                    }}>
                    <View style={styles.addFormWrapper}>
                        <CreateItemForm listId={props.id} />
                    </View>

                    <View style={styles.toolsWrapper}>
                        <TouchableOpacity
                            style={styles.tool}
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
                            }}>
                            <Image
                                source={require('@images/share.png')}
                                style={styles.shareIcon}
                            />
                            <BaseText size={20} bold={true}>
                                SHARE
                            </BaseText>
                        </TouchableOpacity>

                        {shoppingLists.data?.length &&
                            shoppingLists.data?.length > 0 && (
                                <TouchableOpacity
                                    style={styles.tool}
                                    onPress={onAddFromOtherListsPress}>
                                    <Image
                                        source={require('@images/collection.png')}
                                        style={styles.listAddIcon}
                                    />
                                    <BaseText size={20} bold={true}>
                                        ADD FROM LIST
                                    </BaseText>
                                </TouchableOpacity>
                            )}

                        <TouchableOpacity
                            style={styles.tool}
                            onPress={onClearCompletedItemPress}>
                            <Image
                                source={require('@images/badge-check.png')}
                                style={styles.checkIcon}
                            />
                            <BaseText size={20} bold={true}>
                                CLEAR COMPLETED
                            </BaseText>
                        </TouchableOpacity>

                        {list.data?.is_owner && (
                            <TouchableOpacity
                                style={styles.tool}
                                onPress={onDeleteShoppingListPress}>
                                <Image
                                    source={require('@images/trash.png')}
                                    style={styles.trashIcon}
                                />
                                <BaseText size={20} bold={true}>
                                    DELETE
                                </BaseText>
                            </TouchableOpacity>
                        )}

                        {!list.data?.is_owner && (
                            <TouchableOpacity
                                style={styles.tool}
                                onPress={onDeleteShoppingListPress}>
                                <Image
                                    source={require('@images/leave.png')}
                                    style={styles.leaveIcon}
                                />
                                <BaseText size={20} bold={true}>
                                    LEAVE
                                </BaseText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
    },
    footerBg: {
        position: 'absolute',
        bottom: bsl(380),
        right: 0,
        left: 0,
    },
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
        ...paddingX(20),
        ...paddingY(30),
    },
    footerImage: {
        ...sizeImage(1156, 351, { width: 750 }),
        opacity: 0.5,
    },
    paperBagTopImage: {
        marginTop: bsl(-20),
        ...sizeImage(1160, 51, { width: 750 }),
    },
    listScrollView: {
        flex: 1,
    },
    addFormWrapper: {
        zIndex: 100,
        ...paddingY(20),
    },
    listScrollViewContent: {
        padding: bsl(20),
        paddingBottom: bsl(380),
    },
    headerUnderline: {
        height: bsl(10),
    },
    toolsWrapper: {
        ...centeredRow,
        padding: bsl(50),
        justifyContent: 'space-between',
    },
    tool: {
        ...flexCenter,
    },
    shareIconAndroid: {
        ...sizeImage(61, 60, { height: 40 }),
        marginBottom: bsl(15),
    },
    shareIconIos: {
        ...sizeImage(45, 60, { height: 40 }),
        marginBottom: bsl(15),
    },
    listAddIcon: {
        ...sizeImage(60, 60, { height: 40 }),
        marginBottom: bsl(15),
    },
    checkIcon: {
        ...sizeImage(60, 60, { height: 40 }),
        marginBottom: bsl(15),
    },
    trashIcon: {
        ...sizeImage(61, 68, { height: 40 }),
        marginBottom: bsl(15),
    },
    shareIcon: {
        ...sizeImage(68, 68, { height: 40 }),
        marginBottom: bsl(15),
    },
    leaveIcon: {
        ...sizeImage(68, 61, { height: 40 }),
        marginBottom: bsl(15),
    },
});

export default ShoppingList;
