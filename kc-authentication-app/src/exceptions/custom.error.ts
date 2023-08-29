
export class CustomError extends Error {
    constructor(message: string, public detail: string) {
        super(message);
        this.detail = detail;
    }
}