import { useQuery } from 'react-query';
import api from '@/api';
import { Store } from '@/types/Store';

export default () => {
    return useQuery<Store[], Error>('stores', () => {
        return api.get('stores').then((res) => res.data);
    });
};
