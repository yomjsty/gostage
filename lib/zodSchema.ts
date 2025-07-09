import { z } from "zod"

export const loginWithEmailSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
})

export type LoginWithEmailType = z.infer<typeof loginWithEmailSchema>

export const registerWithEmailSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type RegisterWithEmailType = z.infer<typeof registerWithEmailSchema>

export const eventMode = z.enum(["ONLINE", "OFFLINE"])

export const eventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    featuredImage: z.string().min(1, "Featured image is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().min(1, "Location is required"),
    locationLink: z.string().url().optional().or(z.literal("")),
    mode: eventMode,
    maxTicketsPerUser: z.coerce.number().min(1, "Max tickets per user is required"),
}).refine((data) => data.endDate >= data.startDate, {
    message: "End date must not be before start date",
    path: ["endDate"],
})

export type EventSchemaType = z.infer<typeof eventSchema>

export const ticketCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(1, "Price is required"),
    quota: z.coerce.number().min(1, "Quota is required"),
})

export type TicketCategorySchemaType = z.infer<typeof ticketCategorySchema>

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
})

export type AccountSchemaType = z.infer<typeof accountSchema>