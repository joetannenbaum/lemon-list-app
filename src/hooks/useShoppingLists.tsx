import { useQuery } from 'react-query';
import api from '@/api';
import { ShoppingList } from '@/types/ShoppingList';
import { AxiosResponse } from 'axios';
import { ApiResource } from '@/types/ApiResource';

export default (enabled: boolean = true) => {
    return useQuery<ShoppingList[], Error>(
        'shopping-lists',
        () => {
            return api
                .get('shopping-lists')
                .then(
                    (res: AxiosResponse<ApiResource<ShoppingList[]>>) =>
                        res.data.data,
                );
        },
        { enabled },
    );
};
