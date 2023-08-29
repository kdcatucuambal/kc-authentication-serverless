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
    idToken: string,
    accessToken: string,
    refreshToken: string,
}

export interface AdminSetUserPasswordRequest{
    password: string,
    permanent: boolean,
    userPoolId: string,
    username: string
}