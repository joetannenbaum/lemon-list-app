import { useQuery } from 'react-query';
import api from '@/api';
import { User } from '@/types/User';

export default () => {
    return useQuery<User, Error>('me', () => {
        return api.get('user').then((res) => res.data);
    });
};
