import express from 'express';
import { getUserProfile, loginUser, registerUser } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.js';

const userRouter = express.Router();

userRouter.post('/register', validate(registerSchema), registerUser);
userRouter.post('/login', validate(loginSchema), loginUser);

// protected route as token will be required
userRouter.get('/profile', protect, getUserProfile);

export default userRouter;