import { useMutation, useQueryClient } from 'react-query';
import api from '@/api';

export default (id: number) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: object) => {
            return api.put(`items/${id}`, params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('items');
            },
        },
    );
};
