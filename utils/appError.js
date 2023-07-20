class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        //To check if its 404 error the status = fail or 500 error
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;