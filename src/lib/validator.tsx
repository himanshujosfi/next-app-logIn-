import z from "zod";

export const SignInSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long")
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password is too long"),
});

export type Register = z.infer<typeof SignInSchema>;

export const LogInSchema = z.object({
    // username: z
    //     .string()
    //     .min(3, "Username must be at least 3 characters long")
    //     .max(20, "Username must be at most 20 characters long")
    //     .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password is too long"),
});

export type LogInData = z.infer<typeof LogInSchema>;
