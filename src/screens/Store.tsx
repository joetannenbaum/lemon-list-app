import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useStore from '@/hooks/useStore';
// import DraggableFlatList, {
//     DragEndParams,
// } from 'react-native-draggable-flatlist';
import { useQueryCache, useMutation } from 'react-query';
import api from '@/api';
import StoreTag from '@/components/StoreTag';
import { StoreTag as StoreTagType } from '@/types/StoreTag';
import CreateStoreTagForm from '@/components/CreateStoreTagForm';

interface Props extends ScreenProps {
    id: number;
}

const Store: Screen<Props> = (props) => {
    return null;
    const store = useStore(props.id);

    const [tagData, setTagData] = useState(store.data?.tags || []);

    useEffect(() => {
        setTagData(store.data?.tags || []);
    }, [store.data]);

    const queryCache = useQueryCache();

    const [mutate, { status, data, error }] = useMutation(
        (params) => {
            return api.put(`stores/${props.id}/reorder-tags`, params);
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['store', props.id]);
            },
        },
    );

    const onDragEnd = ({ data }: DragEndParams<StoreTagType>) => {
        setTagData(data);

        mutate({
            order: data.map((item) => item.id),
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CreateStoreTagForm storeId={props.id} />
            <DraggableFlatList
                initialNumToRender={30}
                style={{ flex: 1 }}
                data={tagData}
                keyExtractor={(item) => item.id.toString()}
                onDragEnd={onDragEnd}
                renderItem={({ item, drag, isActive }) => (
                    <StoreTag
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

export default Store;
