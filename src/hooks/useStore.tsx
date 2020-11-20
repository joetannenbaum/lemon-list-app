import { useQuery } from 'react-query';
import api from '@/api';
import { Store } from '@/types/Store';

export default (id: number) => {
    return useQuery<Store, Error>(['store', id], () => {
        return api.get(`stores/${id}`).then((res) => res.data);
    });
};
