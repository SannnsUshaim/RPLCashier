import React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScanSchemas } from "@/schemas/scanned";
import { Minus, Plus, Printer, ShoppingCart, Trash2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMoney from "@/components/ui/inputMoney";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

// Mock data produk - ganti dengan API call
const mockProducts = [
  { _id: "8809618376543", nama: "Product 1", harga: 10000, stok: 5 },
  { _id: "8809622345665", nama: "Product 2", harga: 15000, stok: 3 },
  { _id: "800142384835", nama: "Product 3", harga: 12000, stok: 3 },
  { _id: "8996001600146", nama: "Product 4", harga: 20000, stok: 3 },
  { _id: "8993988300403", nama: "Product 5", harga: 25000, stok: 3 },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  const { data: barang } = useSWR("http://localhost:7700/api/product", fetcher);

  const form = useForm<z.infer<typeof ScanSchemas>>({
    resolver: zodResolver(ScanSchemas),
    defaultValues: {
      products: [],
      totalBarang: 0,
      totalHarga: 0,
      bayar: 0,
      kembalian: 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "products",
    control: form.control,
    rules: {
      required: "Minimal 1 Product",
    },
  });

  const [scannedCode, setScannedCode] = React.useState("");
  const [scanError, setScanError] = React.useState("");

  // Watch perubahan nilai
  const totalHarga = useWatch({ control: form.control, name: "totalHarga" });
  const bayar = form.watch("bayar");
  const products = form.watch("products");

  // Handle scan barcode
  React.useEffect(() => {
    let input = "";
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        clearTimeout(timeout);
        processScannedCode(input);
        input = "";
      } else {
        input += e.key;
        clearTimeout(timeout);
        timeout = setTimeout(() => (input = ""), 500);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  const processScannedCode = async (code: string) => {
    try {
      setScannedCode(code);
      setScanError("");

      // Cari produk di database (mock)
      const product = mockProducts.find((p) => p._id === code);
      if (!product) throw new Error("Produk tidak ditemukan");

      // Cek apakah produk sudah ada di keranjang
      const existingIndex = fields.findIndex((p) => p._id === code);

      if (existingIndex > -1) {
        // Update quantity jika masih ada stok
        const currentProduct = form.getValues(`products.${existingIndex}`);
        const currentStock =
          mockProducts.find((p) => p._id === code)?.stok || 0;

        if (currentProduct.quantity + 1 > currentStock) {
          throw new Error("Stok tidak mencukupi");
        }

        update(existingIndex, {
          ...currentProduct,
          quantity: currentProduct.quantity + 1,
        });
      } else {
        // Tambahkan produk baru
        if (product.stok < 1) {
          // Tambahkan validasi stok
          throw new Error("Stok tidak mencukupi");
        }
        append({
          ...product,
          quantity: 1,
        });
      }

      // Update totals
      updateTotals();
    } catch (error) {
      setScanError(error.message);
    }
  };

  const updateTotals = () => {
    const products = form.watch("products");
    const totalBarang = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalHarga = products.reduce(
      (sum, p) => sum + p.harga * p.quantity,
      0
    );

    form.setValue("totalBarang", totalBarang);
    form.setValue("totalHarga", totalHarga);
  };

  React.useEffect(() => {
    if (bayar > 0) {
      const bayar = form.watch("bayar");
      const kembali = bayar - totalHarga;
      form.setValue("kembalian", kembali);
    }
  }, [form, totalHarga, bayar]);

  const handleReset = () => {
    form.reset({
      products: [],
      totalBarang: 0,
      totalHarga: 0,
      bayar: 0,
      kembalian: 0,
    });
  };

  const handleQuantityChange = (index: number, change: number) => {
    const currentProduct = fields[index];
    if (currentProduct.quantity + change < 1) return;
    update(index, {
      ...currentProduct,
      quantity: currentProduct.quantity + change,
    });
    updateTotals();
  };

  const onSubmit = async (values: z.infer<typeof ScanSchemas>) => {
    const product = values.products.map((p) => p);
    if (values.bayar < values.totalHarga) {
      form.setError("bayar", { message: "Jumlah bayar kurang" });
      return;
    }

    if (products.length < 1 || products.length == 0) {
      form.setError("products", { message: "Minimal 1 Product" });
    } else {
      // Navigasi ke halaman print dengan membawa data
      navigate("/cashier/print", {
        state: {
          products: values.products,
          totalBarang: values.totalBarang,
          totalHarga: values.totalHarga,
          bayar: values.bayar,
          kembalian: values.kembalian,
          waktuTransaksi: new Date().toLocaleString(),
        },
      });

      // Reset form setelah print (opsional)
      handleReset();
    }
  };

  return (
    <Form {...form}>
      <form
        id="products"
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white w-full h-full rounded-lg shadow-lg p-5 overflow-y-auto flex flex-col justify-between"
      >
        <div className="flex-1">
          {fields.length === 0 ? (
            <div className="bg-white border-2 border-slate-400 h-full w-full rounded-lg flex flex-col gap-2 justify-center items-center text-slate-300 text-xl font-medium capitalize">
              <ShoppingCart size={50} />
              <p>no product scanned ...</p>

              <FormMessage />
            </div>
          ) : (
            <div className="flex flex-col relative justify-start overflow-x-hidden min-w-max h-auto col-span-12 border-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-10 first-of-type:border-t-0 border-b-[2px] p-4 w-full"
                >
                  <div className="flex flex-col items-center text-sm font-medium space-y-3">
                    <Label>Delete</Label>
                    <Button
                      onClick={() => {
                        remove(index);
                        updateTotals();
                      }}
                      className="bg-red-500 hover:bg-red-400"
                    >
                      <Trash2 size={20} className="text-white" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold">{field.nama}</h3>
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1">
                          <Label>Harga</Label>
                          <p>Rp {field.harga.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label>Qty</Label>
                          <p>{field.quantity}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label>Total</Label>
                          <p>
                            Rp {(field.harga * field.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center justify-center">
                        <div className="bg-red-500 px-2 py-1 rounded-lg text-lighter hover:cursor-pointer">
                          <Minus
                            size={20}
                            onClick={() => handleQuantityChange(index, -1)}
                          />
                        </div>
                        <div className="bg-primary px-2 py-1 rounded-lg text-lighter hover:cursor-pointer">
                          <Plus
                            size={20}
                            onClick={() => handleQuantityChange(index, +1)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Section */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <Label>Total Barang:</Label>
            <span>{form.watch("totalBarang")}</span>
          </div>

          <div className="flex justify-between">
            <Label>Total Harga:</Label>
            <span>Rp {totalHarga.toLocaleString()}</span>
          </div>

          <FormField
            control={form.control}
            name="bayar"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormLabel className="flex gap-1">
                    Jumlah Bayar <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormMessage className="text-xs" />
                </div>
                <FormControl>
                  <InputMoney field={field} defaultValue={field.value} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Label>Kembalian:</Label>
            <span>Rp {form.watch("kembalian").toLocaleString()}</span>
          </div>

          {scanError && (
            <div className="text-red-500 text-base">{scanError}</div>
          )}

          <div className="flex gap-4 mt-4 justify-between">
            <Button
              type="button"
              onClick={handleReset}
              className="bg-primary text-lighter"
            >
              Reset Transaksi
            </Button>
            <Button
              type="submit"
              className="capitalize text-lighter bg-primary"
            >
              <Printer size={15} />
              <p>Print</p>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Dashboard;
