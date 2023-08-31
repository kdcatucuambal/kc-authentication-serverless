export class CustomError2{
 
    constructor(
        public message = 'An error occurred',
        public statusCode = 500,
    ){
        this.message = message;
        this.statusCode = statusCode;
    }

}