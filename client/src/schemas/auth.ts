import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, { message : "Username is required!" }),
  email: z.string().min(1, { message : "User email is required!" }),
  password: z.string().min(1, { message : "User password is required!" }),
})

