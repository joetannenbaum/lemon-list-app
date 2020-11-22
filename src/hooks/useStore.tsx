import { useQuery } from 'react-query';
import api from '@/api';
import { Store } from '@/types/Store';
import { AxiosResponse } from 'axios';
import { ApiResource } from '@/types/ApiResource';

export default (id: number) => {
    return useQuery<Store, Error>(['store', id], () => {
        return api
            .get(`stores/${id}`)
            .then((res: AxiosResponse<ApiResource<Store>>) => res.data.data);
    });
};
