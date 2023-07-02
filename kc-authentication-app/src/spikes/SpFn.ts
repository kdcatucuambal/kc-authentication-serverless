interface RequestObject<T>{
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

interface Credentials {
    username: string,
    password: string
}

const request: RequestObject<Credentials> = {
    header: {
        "Content-Type": "application/json"
    },
    body: {
        password: "password",
        username: "username"
    },
    getBody: {
        queries: {},
        params: {}
    },
    service: {
        apiId: "apiId",
        operationId: "operationId"
    }
}



