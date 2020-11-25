export interface ParsedUrl {
    title: string;
    servings: number;
    url: string;
    image: string;
    items: ParsedUrlItem[];
}

export interface ParsedUrlItem {
    id: number;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    amount: number;
    quantity: number;
    unit: string;
    meta: string[];
}
