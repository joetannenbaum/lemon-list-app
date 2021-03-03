import React, { useState, useEffect, useCallback } from 'react';
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
import { FlatList, StyleSheet, View } from 'react-native';
import { move } from 'formik';
import debounce from 'lodash/debounce';

interface Props extends ScreenProps {
    id: number;
}

const Store: Screen<Props> = (props) => {
    const store = useStore(props.id);

    const storeColor = getColorFromString(store.data?.name);

    const [tagData, setTagData] = useState(store.data?.tags || []);

    useEffect(() => {
        setTagData(store.data?.tags || []);
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

    const reorderViaApi = (params: object) => reorder(params);

    const debouncedReorder = useCallback(
        debounce((params) => reorderViaApi(params), 1000),
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

    if (!store.isFetched) {
        return <Loading />;
    }

    return (
        <Wrapper forceInset={{ top: 'never', bottom: 'never' }}>
            <Header color={storeColor}>{store.data?.name}</Header>
            <FlatList
                style={styles.list}
                data={tagData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
            />
            <Footer color={storeColor}>
                <View style={styles.footer}>
                    <CreateStoreTagForm storeId={props.id} />
                </View>
            </Footer>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: bsl(20),
        paddingVertical: bsl(40),
    },
});

export default Store;
