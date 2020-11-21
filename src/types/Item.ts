import { StoreTag } from './StoreTag';

export interface Item {
    id: number;
    name: string;
    image: null | string;
    store_tags: StoreTag[];
    created_at: string;
    updated_at: string;
}
