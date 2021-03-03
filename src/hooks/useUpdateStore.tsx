import { useMutation, useQueryClient } from 'react-query';
import api from '@/api';

export default (id: number) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: object) => {
            return api.put(`stores/${id}`, params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('stores');
                queryClient.invalidateQueries(['store', id]);
            },
        },
    );
};
