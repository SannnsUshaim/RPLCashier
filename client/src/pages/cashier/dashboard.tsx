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
import { Input } from "@/components/ui/input";
import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const today = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const navigate = useNavigate();

  const { data: barang } = useSWR(
    "http://localhost:7700/api/product/",
    fetcher
  );

  const { data: transaksi_id } = useSWR(
    "http://localhost:7700/api/transaction/id",
    fetcher
  );
  const { data: currentUser } = useSWR(
    "http://localhost:7700/api/users/current",
    fetcher
  );

  const form = useForm<z.infer<typeof ScanSchemas>>({
    resolver: zodResolver(ScanSchemas),
    defaultValues: {
      products: [],
      _id: transaksi_id,
      userId: currentUser?._id,
      totalBarang: 0,
      totalHarga: 0,
      bayar: 0,
      kembalian: 0,
      manualInput: "",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "products",
    control: form.control,
    rules: {
      required: "Minimal 1 Product",
    },
  });

  const [scanError, setScanError] = React.useState("");
  const [manualInput, setManualInput] = React.useState("");

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
  }, [barang]); // Tambahkan dependency pada barang

  const processScannedCode = (code: string) => {
    try {
      console.log("Scanned Code:", code);
      setScanError("");

      // Cari produk di database
      const product = barang?.find((p) => p._id === code);
      if (!product) throw new Error("Produk tidak ditemukan");

      // Cek apakah produk sudah ada di keranjang
      const existingIndex = fields.findIndex((p) => p._id === code);

      if (existingIndex > -1) {
        // Update quantity jika masih ada stok
        const currentProduct = form.getValues(`products.${existingIndex}`);
        const currentStock = barang?.find((p) => p._id === code)?.stok || 0;

        if (currentProduct.stok + 1 > currentStock) {
          throw new Error("Stok tidak mencukupi");
        }

        update(existingIndex, {
          ...currentProduct,
          stok: currentProduct.stok + 1,
        });
      } else {
        // Tambahkan produk baru
        if (product.stok < 1) {
          throw new Error("Stok tidak mencukupi");
        }
        append({
          ...product,
          stok: 1,
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
    const totalBarang = products.reduce((sum, p) => sum + p.stok, 0);
    const totalHarga = products.reduce((sum, p) => sum + p.harga * p.stok, 0);

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

  React.useEffect(() => {
    if (transaksi_id && currentUser) {
      form.reset({
        ...form.getValues(),
        _id: transaksi_id,
        userId: currentUser._id,
      });
    }
  }, [transaksi_id, currentUser]); // Tambahkan effect ini

  const handleReset = () => {
    form.reset({
      products: [],
      manualInput: "",
      totalBarang: 0,
      totalHarga: 0,
      bayar: 0,
      kembalian: 0,
    });
  };

  const handleQuantityChange = (index: number, change: number) => {
    const currentProduct = fields[index];
    if (currentProduct.stok + change < 1) return;
    update(index, {
      ...currentProduct,
      stok: currentProduct.stok + change,
    });
    updateTotals();
  };

  const onSubmit = async (values: z.infer<typeof ScanSchemas>) => {
    console.log("Submitting form with values:", values);
    if (!values._id || !values.userId) {
      toast.error("ID Transaksi atau User tidak valid");
      return;
    }
    try {
      const product = values.products.map((p) => p);

      // Validasi pembayaran
      if (values.bayar < values.totalHarga) {
        form.setError("bayar", { message: "Jumlah bayar kurang" });
        return;
      }

      // Validasi produk
      if (products.length === 0) {
        form.setError("products", { message: "Minimal 1 Product" });
        return;
      }

      // Kirim request
      const response = await axios.post(
        "http://localhost:7700/api/transaction/",
        {
          _id: values._id,
          userId: values.userId,
          totalBarang: values.totalBarang,
          totalHarga: values.totalHarga,
          bayar: values.bayar,
          kembalian: values.kembalian,
          transactionDate: today,
          products: product,
          total: values.totalBarang,
        }
      );
      // Navigasi setelah request sukses
      if (response.status === 201 && response.status < 300) {
        navigate("/cashier/print", {
          state: {
            _id: values._id,
            userId: values.userId,
            products: values.products,
            totalBarang: values.totalBarang,
            totalHarga: values.totalHarga,
            bayar: values.bayar,
            kembalian: values.kembalian,
            waktuTransaksi: today,
          },
        });
        handleReset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Request error!");
    }
  };

  const handleManualSearch = () => {
    processScannedCode(manualInput);
    setManualInput(""); // Reset input setelah pencarian
  };

  React.useEffect(() => {
    if (manualInput) {
      handleManualSearch();
    }
  }, [manualInput]);

  return (
    <Form {...form}>
      <form
        id="products"
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white w-full h-full rounded-lg shadow-lg p-5 overflow-y-auto gap-2 flex flex-col justify-between"
      >
        <div className="flex flex-col flex-1 gap-3">
          <FormField
            control={form.control}
            name="manualInput"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center gap-3 space-y-1">
                  <FormLabel>Manual Input</FormLabel>
                  <FormMessage className="text-xs" />
                </div>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="border-2 border-slate-400 rounded-lg p-2 w-full"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setManualInput(e.target.value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
                    <h3 className="font-bold uppercase">{field.name}</h3>
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-1">
                          <Label>Harga</Label>
                          <p>Rp {field.harga.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label>Qty</Label>
                          <p>{field.stok}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label>Total</Label>
                          <p>
                            Rp {(field.harga * field.stok).toLocaleString()}
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
        <div className="mt-2 space-y-4">
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                "Memproses..."
              ) : (
                <>
                  <Printer size={15} />
                  <p>Print</p>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Dashboard;
