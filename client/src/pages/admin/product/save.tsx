import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSchema } from "@/schemas/product";
import useSWR from "swr";
import axios from "axios";
import { fetcher } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleX, FilePlus } from "lucide-react";
import toast from "react-hot-toast";
import InputMoney from "@/components/ui/inputMoney";

const today = dayjs().format("YYYY-MM-DD");

export const Save = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state?.productId;

  const { data: product_id } = useSWR(
    "http://localhost:7700/api/product/id",
    fetcher
  );

  const { data: product } = useSWR(
    productId ? "http://localhost:7700/api/product/" + productId : null,
    fetcher
  );

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      create_date: today,
      _id: "",
      name: "",
      stok: undefined,
      harga: undefined,
    },
  });

  React.useEffect(() => {
    if (product_id) {
      form.setValue("_id", product_id);
    }
  }, [form, product_id]);

  React.useEffect(() => {
    if (product) {
      form.reset({
        create_date: dayjs(product.createDate).format("YYYY-MM-DD"),
        _id: product._id,
        name: product.name,
        stok: product.stok,
        harga: product.harga,
      });
    }
  }, [form, product]);

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    try {
      if (product) {
        await axios.put("http://localhost:7700/api/product", {
          _id: values._id,
          name: values.name,
          stok: values.stok,
          harga: values.harga,
        });
        navigate("/admin/product");
        toast.success("Product successfully edited!");
      } else {
        await axios.post("http://localhost:7700/api/product", {
          _id: values._id,
          name: values.name,
          stok: values.stok,
          harga: values.harga,
        });
        navigate("/admin/product");
        toast.success("Product successfully added!");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      toast.error("Request error!");
      navigate("/admin/product");
    }
  };
  return (
    <Form {...form}>
      <form
        id="product"
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white w-full h-full rounded-lg shadow-lg px-4 pt-4 overflow-y-auto flex flex-col justify-between"
      >
        <div className="grid grid-cols-12 h-auto gap-x-5">
          <div className="col-span-6">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="create_date"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Create At</FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                    <FormControl>
                      <Input
                        value={field.value}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Product Code</FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                    <FormControl>
                      <Input
                        value={field.value}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Product Name</FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                    <FormControl>
                      <Input {...field} value={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="stok"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Stok</FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="harga"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Product Price</FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                    <FormControl>
                      <InputMoney field={field} defaultValue={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end py-4">
          <a
            href="/admin/product"
            className="flex items-center gap-2 text-sm font-medium transition focus:shadow-md focus:shadow-primary text-primary border-[2px] border-primary py-2 px-4 rounded-md"
          >
            <CircleX size={20} />
            Cancel
          </a>
          <Button
            type="submit"
            className="flex items-center gap-2 text-lighter"
          >
            <FilePlus size={20} />
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Save;
