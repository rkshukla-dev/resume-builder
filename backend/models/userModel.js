import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false}
}, {
    timestamps: true,
    versionKey: false,
});

// Hash password before saving
userSchema.pre('save', async function() {
    // Only hash password if it has been changed
    if(this.isModified('password')) {
        // Generate Salt
        const salt = await bcrypt.genSalt(10);

        // Hash password using generated salt
        this.password = await bcrypt.hash(this.password, salt);
    }
})

const User = mongoose.model('User', userSchema);

export const getUsers = () => User.find();
export const getUserByEmail = (email) => User.findOne({ email });
export const getUserById = (id) => User.findById(id);

export default User;