import { Item } from './Item';

export interface ShoppingListItem {
    id: number;
    shopping_list_version_id: number;
    item: Item;
    order: number;
    quantity: number;
    created_at: string;
    updated_at: string;
}
