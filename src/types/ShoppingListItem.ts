import { Item } from './Item';

export interface ShoppingListItem {
    id: number;
    shopping_list_version_id: number;
    item: Item;
    order: number;
    note: string | null;
    quantity: number;
    created_at: string;
    updated_at: string;
    checked_off: boolean;
}
