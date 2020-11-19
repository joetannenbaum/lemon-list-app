import { useQuery } from 'react-query';
import api from '@/api';
import { Item } from '@/types/Item';

export default () => {
    return useQuery<Item[], Error>('items', () => {
        return api.get('items').then((res) => res.data);
    });
};
