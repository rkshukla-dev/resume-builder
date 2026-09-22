import { env } from "../config/env.js";
import { getUserById } from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCookie } from "../utils/cookie.js";
import jwt from "jsonwebtoken";

export const protect = asyncHandler(async (req, res, next) => {
    // Get Access token from cookie
    const token = getCookie(req, 'accessToken');
    if(!token) throw new AppError('Authentication Required', 401, 'AUTH_REQUIRED');

    // Verify token
    const decoded = jwt.verify(token, env.jwtAccessSecret);

    // Get user from database
    const user = await getUserById(decoded?.id);

    // Check if user still exists
    if(!user) throw new AppError('User no longer exits', 401, 'USER_NOT_FOUND');

    // Attach user to request
    req.user = user;
    
    // continue to the controller
    next();
});