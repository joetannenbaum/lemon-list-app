import { StoreTag } from './StoreTag';

export interface Store {
    id: number;
    user_id: number;
    name: string;
    image: string | null;
    tags: StoreTag[];
}
