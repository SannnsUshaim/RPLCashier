import { z } from "zod";

export const ScanSchemas = z.object({
  totalBarang: z.number(),
  totalHarga: z.number(),
  bayar: z.number(),
  kembalian: z.number(),
  products: z.array(
    z.object({
      _id: z.string(),
      nama: z.string(),
      harga: z.number(),
      quantity: z.number(),
    })
  ),
});
