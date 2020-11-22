import { useQuery } from 'react-query';
import api from '@/api';
import { Store } from '@/types/Store';
import { AxiosResponse } from 'axios';
import { ApiResource } from '@/types/ApiResource';

export default () => {
    return useQuery<Store[], Error>('stores', () => {
        return api
            .get('stores')
            .then((res: AxiosResponse<ApiResource<Store[]>>) => res.data.data);
    });
};
