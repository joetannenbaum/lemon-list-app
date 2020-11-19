import { ShoppingListVersion } from './ShoppingListVersion';

export interface ShoppingList {
    id: number;
    user_id: number;
    name: string;
    uuid: string;
    image: string | null;
    active_version: null | ShoppingListVersion;
}
