export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    orderDate: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}