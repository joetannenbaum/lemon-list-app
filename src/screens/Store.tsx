import React, { useState, useEffect } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useStore from '@/hooks/useStore';
import { useQueryClient, useMutation } from 'react-query';
import api from '@/api';
import StoreTag from '@/components/StoreTag';
import { StoreTag as StoreTagType } from '@/types/StoreTag';
import CreateStoreTagForm from '@/components/CreateStoreTagForm';
import SortableList from '@/components/SortableList';

interface Props extends ScreenProps {
    id: number;
}

const Store: Screen<Props> = (props) => {
    const store = useStore(props.id);

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CreateStoreTagForm storeId={props.id} />
            <SortableList
                data={tagData}
                onUpdate={onDragEnd}
                renderItem={(item, index, dragging) => (
                    <StoreTag
                        item={item}
                        key={item.id.toString()}
                        dragging={dragging}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Store;
