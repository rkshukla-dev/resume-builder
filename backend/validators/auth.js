import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string({ error: "Name is required" }).trim()
        .min(2, "Name must be atleast 2 characters")
        .max(80, "Name cannot exceed 80 characters"),
    email: z
        .string({ error: "Email is required" }).trim()
        .email('Please enter a valid email address'),
    password: z
        .string({ error: "Password is required" })
        .min(8, "Password must be atleast 8 characters")
        .max(128, "Password cannot exceed 128 characters")
})

export const loginSchema = z.object({    
    email: z
        .string({ error: "Email is required" }).trim()
        .email('Please enter a valid email address'),
    password: z
        .string({ error: "Password is required" })
        .min(8, "Password must be atleast 8 characters")
        .max(128, "Password cannot exceed 128 characters")
})