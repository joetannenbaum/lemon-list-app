import { useQuery } from 'react-query';
import api from '@/api';
import { User } from '@/types/User';
import { ApiResource } from '@/types/ApiResource';
import { AxiosResponse } from 'axios';

export default () => {
    return useQuery<User, Error>('me', () => {
        return api
            .get('user')
            .then((res: AxiosResponse<ApiResource<User>>) => res.data.data);
    });
};
