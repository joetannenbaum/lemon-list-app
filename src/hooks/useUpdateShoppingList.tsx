import { useMutation, useQueryCache } from 'react-query';
import api from '@/api';

export default (id: number) => {
    const queryCache = useQueryCache();

    return useMutation(
        (params: object) => {
            return api.put(`shopping-lists/${id}`, params);
        },
        {
            onSuccess() {
                queryCache.invalidateQueries('shopping-lists');
                queryCache.invalidateQueries(['shopping-list', id]);
            },
        },
    );
};
