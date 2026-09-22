import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if(!result.success) {
        const fields = {};
        for (const issue of result.error.issues) {
            const field = issue.path.join('.');
            if(!fields[field]) {
                fields[field] = [];
            }
            fields[field] = issue.message;
        }
        return next(new AppError('Validation Failed', 400, 'VALIDATION_ERROR', { ...fields }))
    }
    req.body = result.data;
    next();
}