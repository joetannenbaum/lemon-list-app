import { useMutation, useQueryCache } from 'react-query';
import api from '@/api';

export default (listId: number, listVersionId: number, itemId: number) => {
    const queryCache = useQueryCache();

    return useMutation(
        (params: object) => {
            return api.put(
                `shopping-list-versions/${listVersionId}/items/${itemId}`,
                params,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['shopping-list', listId]);
            },
        },
    );
};
