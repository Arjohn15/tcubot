"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistrants = void 0;
const validateRegistrants = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            message: "Validation error",
            error: result.error.flatten().fieldErrors,
        });
        return;
    }
    req.body = result.data;
    next();
};
exports.validateRegistrants = validateRegistrants;
