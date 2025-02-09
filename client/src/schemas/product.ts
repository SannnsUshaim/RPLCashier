import { z } from "zod";
// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_FILE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

export const ProductSchema = z.object({
  create_date: z.string().min(1, { message: "Create Date is Required!" }),
  _id: z.string().min(1, { message: "Product Id is Required!" }),
  name: z.string().min(1, { message: "Product Name is Required!" }),
  stok: z.number().min(1, { message: "Stok is Required" }),
  harga: z.number().min(1, { message: "Product Price is Required!" }),
  manualCode: z.boolean().optional(),
  manualCode_value: z.number().optional()
  // attachment: z.array(
  //   z.object({
  //     attachmentP: z
  //       .instanceof(File)
  //       .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file is 5MB.")
  //       .refine(
  //         (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
  //         "Only .jpg, .jpeg, .png and .webp formats are supported."
  //       ),
  //   })
  // ),
});
