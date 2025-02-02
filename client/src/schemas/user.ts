import {z} from "zod"

export const UserSchema = z.object({
    create_date: z.string().min(1, {message: "Create Date is Required!"}),
    _id: z.string().min(1, {message: "User Id is Required!"}),
    username: z.string().min(1, {message: "Username is Required!"}),
    email: z.string().min(1, {message: "Email is Required!"}),
    password: z.string().min(1, {message: "Password is Required!"}),
})