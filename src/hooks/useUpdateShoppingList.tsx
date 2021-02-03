import { useMutation, useQueryClient } from 'react-query';
import api from '@/api';

export default (id: number) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: object) => {
            return api.put(`shopping-lists/${id}`, params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('shopping-lists');
                queryClient.invalidateQueries(['shopping-list', id]);
            },
        },
    );
};
