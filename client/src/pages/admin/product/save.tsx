import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { ProductSchema } from "@/schemas/product";
import useSWR from "swr";
import axios from "axios";
import { fetcher } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookDashed,
  CircleX,
  Eye,
  FilePlus,
  PlusCircle,
  Trash2,
} from "lucide-react";
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

  const [file, setFile] = React.useState<File | undefined>(undefined);

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

  const { fields, append, remove } = useFieldArray({
    name: "attachment",
    control: form.control,
    rules: {
      required: "Minimal 1",
    },
  });

  React.useEffect(() => {
    if (product_id) {
      form.setValue("_id", product_id);
    }
  }, [form, product_id]);

  // React.useEffect(() => {
  //   if (file) {
  //     form.setValue("attachmentP", file);
  //   }
  // }, [form, file]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:7700/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { ref } = res.data;
      return ref;
    } catch (e) {
      console.error("Error uploading file", e);
      throw e; // Re-throw the error to handle it in the `onSubmit` function
    }
  };

  // const uploadFile = async () => {
  //   const formData = new FormData();
  //   if (file) {
  //     formData.append("file", file);

  //     try {
  //       const res = await axios.post(
  //         "http://localhost:7700/api/upload",
  //         formData
  //       );
  //       const { ref } = res.data;
  //       return ref;
  //     } catch (error) {
  //       console.error("Error uploading file", error);
  //       throw error; // Re-throw the error to handle it in the `onSubmit` function
  //     }
  //   }
  // };

  React.useEffect(() => {
    if (product) {
      form.reset({
        create_date: dayjs(product.createDate).format("YYYY-MM-DD"),
        _id: product._id,
        name: product.name,
        stok: product.stok,
        harga: product.harga,
        attachment: product.attachment.map((attachment) => ({
          attachmentP: attachment.attachmentP, // This should be a URL (string)
        })),
      });
    }
  }, [form, product]);

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    try {
      // Upload files and get their references
      const attachmentRefs = await Promise.all(
        values.attachment.map(async (attachment) => {
          if (attachment.attachmentP) {
            const ref = await uploadFile(attachment.attachmentP);
            return { attachmentP: ref };
          }
          return { attachmentP: null }; // Handle cases where no file is provided
        })
      );

      console.log(attachmentRefs);

      // Prepare the payload
      const payload = {
        _id: values._id,
        name: values.name,
        stok: values.stok,
        harga: values.harga,
        attachment: attachmentRefs,
      };

      // Send the request
      if (product) {
        await axios.put("http://localhost:7700/api/product", payload);
        toast.success("Product successfully edited!");
      } else {
        await axios.post("http://localhost:7700/api/product", payload);
        toast.success("Product successfully added!");
      }

      navigate("/admin/product");
    } catch (error) {
      console.error("Error submitting form:", error);
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
          <div className="flex flex-col col-span-12 gap-3 overflow-x-auto border-[2px] rounded-lg border-gray-300 mt-5">
            {fields.length === 0 ? (
              <>
                <div className="flex flex-col w-full text-gray-400 bg-gray-100 gap-2 border-[2px] items-center justify-center border-gray-200 p-4 rounded-lg capitalize">
                  <BookDashed size={65} />
                  no data
                </div>
                <FormMessage className="text-red-500">
                  {form.formState.errors.attachment?.message}
                </FormMessage>
              </>
            ) : (
              <div className="flex flex-col relative justify-start overflow-x-auto min-w-max h-auto col-span-12">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-10 first-of-type:border-t-0 border-b-[2px] p-4 w-full"
                  >
                    <div className="flex flex-col items-center text-sm font-medium space-y-3">
                      <Label>Delete</Label>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // setSelectedJobOrder((prev) => {
                          //   if (!prev || prev.length === 0) return prev;
                          //   return prev.filter((_, i) => i !== index);
                          // });
                          remove(index);
                        }}
                        className="bg-red-500 hover:bg-red-400"
                      >
                        <Trash2 size={20} className="text-white" />
                      </Button>
                    </div>
                    <div className="flex gap-4 h-full">
                      <FormField
                        control={form.control}
                        name={`attachment.${index}.attachmentP`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2 items-center">
                              <FormLabel>
                                {product ? (
                                  <div className="flex gap-1 space-y-2 w-full items-end">
                                    Attachment
                                    <span className="text-red-500">*</span>
                                    <a
                                      href={product.attachmentP}
                                      title="View The Previous Attachment"
                                      rel="noopener noreferrer"
                                    >
                                      <Eye
                                        size={15}
                                        className="w-full px-2 hover:cursor-pointer hover:text-primary"
                                      />
                                    </a>
                                  </div>
                                ) : (
                                  <>
                                    Attachment{" "}
                                    <span className="text-red-500">*</span>
                                  </>
                                )}
                              </FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Input
                                type="file"
                                // value={String(field.value)}
                                className="hover:cursor-pointer"
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFile(e.target.files[0]);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              append({
                attachmentP: undefined,
              });
            }}
            className="flex items-center gap-2 font-medium mt-5 text-lighter"
          >
            <PlusCircle size={20} fill="white" className="text-primary" />
            Add
          </Button>
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
