import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  password: z.string()
    .min(1, "Password is required")
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  role: z.enum(["CLIENT", "FREELANCER"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
