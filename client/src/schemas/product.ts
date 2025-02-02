import {z} from "zod"

export const ProductSchema = z.object({
    create_date: z.string().min(1, {message: "Create Date is Required!"}),
    _id: z.string().min(1, {message: "Product Id is Required!"}),
    name: z.string().min(1, {message: "Product Name is Required!"}),
    stok: z.number().min(1, {message: "Stok is Requried"}),
    harga: z.number().min(1, {message: "Product Price is Required!"}),
})