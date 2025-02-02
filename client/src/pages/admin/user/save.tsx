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
import { UserSchema } from "@/schemas/user";
import useSWR from "swr";
import axios from "axios";
import { fetcher } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleX, FilePlus } from "lucide-react";
import toast from "react-hot-toast";
import InputMoney from "@/components/ui/inputMoney";

const today = dayjs().format("YYYY-MM-DD");

export const Save = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  console.log(userId);

  const { data: user_id } = useSWR(
    "http://localhost:7700/api/users/id",
    fetcher
  );

  const { data: user } = useSWR(
    userId ? "http://localhost:7700/api/users/" + userId : null,
    fetcher
  );
  console.log(user);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      create_date: today,
      _id: "",
      username: "",
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (user_id) {
      form.setValue("_id", user_id);
    }
  }, [form, user_id]);

  React.useEffect(() => {
    if (user) {
      form.reset({
        create_date: dayjs(user.createDate).format("YYYY-MM-DD"),
        _id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      });
    }
  }, [form, user]);

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    try {
      if (user) {
        await axios.put("http://localhost:7700/api/users", {
          _id: values._id,
          username: values.username,
          email: values.email,
          password: values.password,
        });
        navigate("/admin/users");
        toast.success("User successfully edited!");
      } else {
        await axios.post("http://localhost:7700/api/users", {
          _id: values._id,
          username: values.username,
          email: values.email,
          password: values.password,
        });
        navigate("/admin/users");
        toast.success("User successfully added!");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      toast.error("Request error!");
      navigate("/admin/users");
    }
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        id="user"
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
                      <FormLabel>User Id</FormLabel>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Username</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Email</FormLabel>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 space-y-1">
                      <FormLabel>Pasword</FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value && user ? "*******" : field.value}
                        readOnly={user ? true : false}
                        className={user ? "bg-gray-100 cursor-not-allowed" : ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end py-4">
          <a
            href="/admin/users"
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
