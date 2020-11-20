import { useMutation, useQueryCache } from 'react-query';
import api from '@/api';

export default (listId: number, listVersionId: number, itemId: number) => {
    const queryCache = useQueryCache();

    return useMutation(
        () => {
            return api.delete(
                `shopping-list-versions/${listVersionId}/items/${itemId}`,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['shopping-list', listId]);
            },
        },
    );
};
