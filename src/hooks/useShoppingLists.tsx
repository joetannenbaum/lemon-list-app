import { useQuery } from 'react-query';
import api from '@/api';
import { ShoppingList } from '@/types/ShoppingList';

export default () => {
    return useQuery<ShoppingList[], Error>('shopping-lists', () => {
        return api.get('shopping-lists').then((res) => res.data);
    });
};
