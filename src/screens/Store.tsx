import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import useStore from '@/hooks/useStore';
import { useQueryClient, useMutation } from 'react-query';
import api from '@/api';
import StoreTag from '@/components/StoreTag';
import CreateStoreTagForm from '@/components/CreateStoreTagForm';
import Loading from '@/components/Loading';
import Wrapper from '@/components/Wrapper';
import { getColorFromString, bsl } from '@/util/style';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { move } from 'formik';
import debounce from 'lodash/debounce';
import FooterToolButton from '@/components/FooterToolButton';
import { showPopup, setStackRootWithoutAnimating } from '@/util/navigation';
import FooterTools from '@/components/FooterTools';
import FooterForm from '@/components/FooterForm';

interface Props extends ScreenProps {
    id: number;
}

const Store: Screen<Props> = (props) => {
    const store = useStore(props.id);

    const storeColor = getColorFromString(store.data?.name);

    const [tagData, setTagData] = useState(store.data?.tags || []);

    const listRef = useRef<null | FlatList>();

    useEffect(() => {
        const newState = store.data?.tags || [];

        const itemAdded =
            tagData.length > 0 && newState.length > tagData.length;

        setTagData(newState);

        if (itemAdded) {
            setTimeout(() => {
                listRef.current?.scrollToEnd();
            }, 500);
        }
    }, [store.data]);

    const queryClient = useQueryClient();

    const { mutateAsync: reorder, status, data, error } = useMutation(
        (params) => {
            return api.put(`stores/${props.id}/reorder-tags`, params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['store', props.id]);
            },
        },
    );

    const { mutateAsync: deleteStore } = useMutation(
        () => {
            return api.delete(`stores/${store.data?.id}`);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('stores');
            },
        },
    );

    const debouncedReorder = useCallback(
        debounce((params) => () => reorder(params), 1000),
        [],
    );

    const onItemMove = (index: number, direction: number) => {
        setTagData((state) => {
            const newState = move(state, index, index + direction);

            debouncedReorder({
                order: newState.map((item) => item.id),
            });

            return newState;
        });
    };

    const renderItem = useCallback(
        ({ item, index }) => (
            <StoreTag
                isFirst={index === 0}
                isLast={index === tagData.length - 1}
                index={index}
                onMove={onItemMove}
                item={item}
                key={item.id.toString()}
            />
        ),
        [],
    );

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    const onDeleteShoppingListPress = useCallback(() => {
        return Alert.alert(
            `Delete ${store.data?.name}?`,
            'You cannot undo this action.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteStore().then(() => {
                            setStackRootWithoutAnimating('App');
                        });
                    },
                },
            ],
        );
    }, []);

    if (!store.isFetched) {
        return <Loading />;
    }

    return (
        <Wrapper forceInset={{ top: 'never', bottom: 'never' }}>
            <Header color={storeColor}>{store.data?.name}</Header>
            <FlatList
                ref={listRef}
                style={styles.list}
                data={tagData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                initialNumToRender={15}
            />
            <Footer color={storeColor}>
                <View style={styles.footer}>
                    <FooterForm>
                        <CreateStoreTagForm storeId={props.id} />
                    </FooterForm>
                    <FooterTools center={true}>
                        <FooterToolButton
                            onPress={() =>
                                showPopup('EditStore', {
                                    id: props.id,
                                })
                            }
                            icon={require('@images/pencil.png')}
                            iconWidth={78}
                            iconHeight={79}>
                            Edit
                        </FooterToolButton>

                        <FooterToolButton
                            onPress={onDeleteShoppingListPress}
                            icon={require('@images/trash.png')}
                            iconWidth={61}
                            iconHeight={68}>
                            Delete
                        </FooterToolButton>
                    </FooterTools>
                </View>
            </Footer>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
});

export default Store;
