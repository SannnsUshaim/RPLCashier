import { z } from "zod";

export const ScanSchemas = z.object({
  totalBarang: z.number(),
  totalHarga: z.number(),
  bayar: z.number(),
  kembalian: z.number(),
  product: z.array(
    z.object({
      productId: z.string(),
      nama: z.string(),
      harga: z.number(),
      jumlah: z.number(),
    })
  ),
});
