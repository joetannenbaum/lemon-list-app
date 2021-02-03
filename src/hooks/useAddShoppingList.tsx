import { useMutation, useQueryClient } from 'react-query';
import api from '@/api';

export default () => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: object) => {
            return api.post('shopping-lists', params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('shopping-lists');
            },
        },
    );
};
