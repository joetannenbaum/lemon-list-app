import { ShoppingListItem } from './ShoppingListItem';

export interface ShoppingListVersion {
    id: number;
    shopping_list_id: number;
    items: ShoppingListItem[];
    archived_at: null | string;
    created_at: string;
    updated_at: string;
}
