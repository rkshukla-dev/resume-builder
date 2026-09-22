import { env } from "../config/env.js";

const isProduction = env.nodeEnv === 'production';

const defaultCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
}

export const getCookie = (req, name) => {
    return req.cookies[name];
}

export const setCookie = (res, name, value, options = {}) => {
    res.cookie(name, value, { ...defaultCookieOptions, ...options })
}

export const clearCookie = (res, name, options) => {
    res.clearCookie(name, { ...defaultCookieOptions, ...options })
}