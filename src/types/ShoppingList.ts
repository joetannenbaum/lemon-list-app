import { ShoppingListVersion } from './ShoppingListVersion';

export interface ShoppingList {
    id: number;
    user_id: number;
    name: string;
    uuid: string;
    image: string | null;
    is_shared: boolean;
    is_owner: boolean;
    active_version: null | ShoppingListVersion;
    total_items: number;
}
