export interface AuthUserCredentials {
    username: string,
    password: string
}

export interface AuthLoginResponse {
    idToken: string,
    accessToken: string,
    refreshToken: string,
}