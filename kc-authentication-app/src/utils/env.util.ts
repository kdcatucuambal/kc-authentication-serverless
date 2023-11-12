


export class EnvUtil{


    static getEnvVar(key: string): string {
        return process.env[key];
    }

    static getEnvVarOrThrow(key: string): string {
        const value = EnvUtil.getEnvVar(key);
        if(value === null) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
        return value;
    }

    static getObjectEnvVarOrThrow(keys: string[]): string[]{
        const result: string[] = [];
        for(const key of keys){
            result.push(EnvUtil.getEnvVarOrThrow(key));
        }
        return result;
    }

    static getEnvVarOrThrowArray(key: string): string[] {
        const value = EnvUtil.getEnvVar(key);
        if(value === null) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
        return value.split(",");
    }

    static getAuthClientId(): string {
        return EnvUtil.getEnvVarOrThrow('AUTH_CLIENT_ID');
    }

    static getAuthSecretClient(): string {
        return EnvUtil.getEnvVarOrThrow('AUTH_SECRET_CLIENT');
    }

    static getAuthAwsRegion(): string {
        return EnvUtil.getEnvVarOrThrow('AUTH_AWS_REGION');
    }

}