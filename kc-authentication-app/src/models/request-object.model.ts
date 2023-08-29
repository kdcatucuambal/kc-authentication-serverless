export interface RequestObjectModel<T>{
    header: Record<string, string>,
    body: T,
    getBody:{
        queries: Record<string, string>,
        params: Record<string, string>
    },
    service:{
        apiId: string,
        operationId: string,
    }
}

export interface ResponseObject<T>{
    statusCode: number,
    body: T,
    headers: Record<string, string>
}