import { useMutation, useQueryClient } from 'react-query';
import api from '@/api';

export default (listId: number, listVersionId: number, itemId: number) => {
    const queryClient = useQueryClient();

    return useMutation(
        () => {
            return api.delete(
                `shopping-list-versions/${listVersionId}/items/${itemId}`,
            );
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['shopping-list', listId]);
                queryClient.invalidateQueries('items');
            },
        },
    );
};
