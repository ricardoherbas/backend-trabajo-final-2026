export class AppError extends Error {
    public statusCode: number;

    constructor(
        mensaje: string,
        statusCode: number
    ) {
        super(mensaje);

        this.name = 'AppError';
        this.statusCode = statusCode;

        Object.setPrototypeOf(
            this,
            AppError.prototype
        );
    }
}