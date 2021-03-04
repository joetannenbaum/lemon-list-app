export interface ParsedUrl {
    title: string;
    servings: number;
    url: string;
    image: string;
    items: ParsedItem[];
}

export interface ParsedItem {
    id: string;
    item_id: number;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    amount: number;
    quantity: number;
    unit: string;
    meta: string[];
}
