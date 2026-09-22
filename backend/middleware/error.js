import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next) => next(new AppError(`Route not found: ${req.originalUrl}`, 404, 'NOT_FOUND'));

export const errorHandler = (err, req, res, next) => {
    let error = err;

    if(err instanceof mongoose.Error.ValidationError) {
        error = new AppError('Database validation failed', 400, 'VALIDATION_ERROR', err.errors);
    } else if(err instanceof mongoose.Error.CastError) {
        error = new AppError('Invalid resource indentifier', 400, 'INVALID_ID');
    } else if(err?.code === 11000) {
        const fields = Object.keys(err.keyPattern || {});
        error = new AppError(`Duplicate value for: ${fields.join(', ')}`, 409, 'DUPLICATE_RESOURCE');
    }

    const status = error.statusCode || 500;
    const response = {
        success: false,
        error: {
            code: error.code || 'INTERNAL_ERROR',
            message: status >= 500 ? 'Internal Server Error' : error.message
        }
    };

    if(error.details) response.error.details = error.details;

    console.error(error);
    res.status(status).json(response);
}
