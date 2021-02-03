import { useMutation, useQueryClient } from 'react-query';
import api from '@/api';

export default (listId: number, listVersionId: number, itemId: number) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: object) => {
            return api.put(
                `shopping-list-versions/${listVersionId}/items/${itemId}`,
                params,
            );
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['shopping-list', listId]);
            },
        },
    );
};
