import { z } from "zod";

export const ScanSchemas = z.object({
  manualInput: z.string(),
  _id: z.string(),
  userId: z.string(),
  totalBarang: z.number(),
  totalHarga: z.number(),
  bayar: z.number(),
  kembalian: z.number(),
  products: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
      harga: z.number(),
      stok: z.number(),
    })
  ),
});
