import User, { getUserByEmail, getUserById } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { setCookie } from '../utils/cookie.js';

// Generate a token JWT
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, env.jwtAccessSecret, { expiresIn: '15m' })
}

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, env.jwtRefreshSecret, { expiresIn: '7d' })
}

// User Register
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists or not
    const isUserExists = await getUserByEmail(email);
    if(isUserExists) throw new AppError('User already exists', 409, 'EMAIL_EXISTS');

    const user = await User.create({
        name, email, password
    });

    return res.status(201).json({
        success: true,
        message: 'User Created Successfully'
    });
});

// User login
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email).select('+password');
    if(!user) throw new AppError('User not found', 400, 'USER_NOT_EXISTS');

    // Compare the password
    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setCookie(res, 'accessToken', accessToken, { maxAge: 15 * 60 * 1000 });
    setCookie(res, 'refreshToken', refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
        success: true,
        message: 'Login successful',
        data: {
            user: { _id: user._id, name: user.name, email: user.email }
        }
    });
});

// Get user profile function
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await getUserById(req.user.id);
    if(!user) throw new AppError('User not found', 404, 'USER_NOT_EXISTS');

    res.json(user);
});