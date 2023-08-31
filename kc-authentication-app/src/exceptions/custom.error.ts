
export class CustomError extends Error {
    constructor(message: string, public detail: any) {
        super(message);
        this.detail = detail;
    }
}