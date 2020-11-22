import { useQuery } from 'react-query';
import api from '@/api';
import { ShoppingList } from '@/types/ShoppingList';
import { AxiosResponse } from 'axios';
import { ApiResource } from '@/types/ApiResource';

export default (id: number) => {
    return useQuery<ShoppingList, Error>(['shopping-list', id], () => {
        return api
            .get(`shopping-lists/${id}`)
            .then(
                (res: AxiosResponse<ApiResource<ShoppingList>>) =>
                    res.data.data,
            );
    });
};
