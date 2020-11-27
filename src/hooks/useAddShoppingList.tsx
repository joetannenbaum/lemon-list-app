import { useMutation, useQueryCache } from 'react-query';
import api from '@/api';

export default () => {
    const queryCache = useQueryCache();

    return useMutation(
        (params: object) => {
            return api.post('shopping-lists', params);
        },
        {
            onSuccess() {
                queryCache.invalidateQueries('shopping-lists');
            },
        },
    );
};
