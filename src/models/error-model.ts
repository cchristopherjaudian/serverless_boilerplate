export interface ResponseError {
    statusCode?: string | undefined;
    status?: number | undefined;
    message?: string;
    stack?: string;
}