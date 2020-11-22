import { useQuery } from 'react-query';
import api from '@/api';
import { Item } from '@/types/Item';
import { AxiosResponse } from 'axios';
import { ApiResource } from '@/types/ApiResource';

export default () => {
    return useQuery<Item[], Error>('items', () => {
        return api
            .get('items')
            .then((res: AxiosResponse<ApiResource<Item[]>>) => res.data.data);
    });
};
