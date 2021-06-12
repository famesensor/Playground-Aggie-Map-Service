export class ErrorReponse extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public validateError?: any
    ) {
        super(message);
    }
}
