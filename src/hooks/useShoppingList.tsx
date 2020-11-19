import { useQuery } from 'react-query';
import api from '@/api';
import { ShoppingList } from '@/types/ShoppingList';

export default (id: number) => {
    return useQuery<ShoppingList, Error>(['shopping-list', id], () => {
        return api.get(`shopping-lists/${id}`).then((res) => res.data);
    });
};
