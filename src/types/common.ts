export interface SuccessResponse<T> {
    message: string;
    status: number;
    data: T;
}


export interface ErrorResponse {
    message: string;
    status: number;
    error: string;
    timestamp: string;
}