export interface Store {
    id: number;
    store_name: string; 
}

export interface StoreResponse {
    stores: Store[] | null;
    error: string | null;
}