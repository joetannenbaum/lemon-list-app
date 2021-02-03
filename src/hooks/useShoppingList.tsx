import { useQuery } from 'react-query';
import api from '@/api';
import { ShoppingList } from '@/types/ShoppingList';
import { AxiosResponse, AxiosError } from 'axios';
import { ApiResource } from '@/types/ApiResource';

export default (id: number) => {
    return useQuery<ShoppingList, Error>(['shopping-list', id], () => {
        return api
            .get(`shopping-lists/${id}`)
            .then(
                (res: AxiosResponse<ApiResource<ShoppingList>>) =>
                    res.data.data,
            )
            .catch((error: AxiosError) => {
                if (error.response?.status === 404) {
                    // This list was deleted
                    return null;
                }

                throw error;
            });
    });
};
