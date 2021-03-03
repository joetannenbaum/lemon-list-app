import React, { useState, useEffect, useCallback } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useStore from '@/hooks/useStore';
import { useQueryClient, useMutation } from 'react-query';
import api from '@/api';
import StoreTag from '@/components/StoreTag';
import { StoreTag as StoreTagType } from '@/types/StoreTag';
import CreateStoreTagForm from '@/components/CreateStoreTagForm';
import SortableList from '@/components/SortableList';
import Loading from '@/components/Loading';
import Wrapper from '@/components/Wrapper';
import { getColorFromString, bsl } from '@/util/style';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FlatList, StyleSheet, View } from 'react-native';

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

    const { mutateAsync, status, data, error } = useMutation(
        (params) => {
            return api.put(`stores/${props.id}/reorder-tags`, params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['store', props.id]);
            },
        },
    );

    const onDragEnd = (data: DragEndParams<StoreTagType>) => {
        setTagData(data);

        mutateAsync({
            order: data.map((item) => item.id),
        });
    };

    const renderItem = useCallback(
        ({ item, index }) => <StoreTag item={item} key={item.id.toString()} />,
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
