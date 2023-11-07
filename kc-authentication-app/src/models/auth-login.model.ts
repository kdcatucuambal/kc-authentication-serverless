export interface AuthUserCredentials {
    username: string,
    password: string
}

export interface AuthChangePassword {
    previousPassword: string,
    proposedPassword: string,
    token: string
}


export interface AuthLoginResponse {
    statusMessage: string,
    credentials?:{
        idToken: string,
        accessToken: string,
        refreshToken: string,
    }
}

export interface AdminSetUserPasswordRequest{
    password: string,
    permanent: boolean,
    userPoolId: string,
    username: string
}

export interface AuthChangePasswordV2Rq{
    authentication: {
        login: string
    },
    session: string,
    newPassword: string
}



export interface AdminSetUserPasswordResponse{
    statusHttpCommand: number,
    message: string
}