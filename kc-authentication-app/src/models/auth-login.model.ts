export interface AuthUserCredentials {
    username: string,
    password: string
}

export interface AuthLoginRq {
    authentication: {
        login: string,
        password: string
    }
}

export interface AuthLoginRs {
    authenticationResult: {
        message: string,
        credentials?: {
            accessToken: string
        },
        session?: string,
        nextChallenge: string
    }
}

export interface AdminSetUserPasswordRq {
    password: string,
    permanent: boolean,
    userPoolId: string,
    username: string
}

export interface AdminSetUserPasswordRs {
    statusHttpCommand: number,
    message: string
}

export interface AuthChangePasswordRq {
    changePassword: {
        authentication: {
            login: string
        },
        session: string,
        password: string
    }
}

export interface AuthChangePasswordRs {
    changePasswordResult: {
        message: string,
        nextChallenge: string
    }
}


export interface AuthSignUpRq {
    authentication: {
        username: string,
        password: string,
    }
    attributes: {
        email: string,
        phoneNumber: string,
        "name": string,
        "lastName": string
    }
}

export interface AuthSignUpRs {
    authSignUpResult: {
        username: string,
        message: string,
        nextChallenge: string
    }

}