import Logo from "@/components/element/logo";
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
import { LoginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const Login = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const request = await axios.post("http://localhost:7700/api/auth/login", {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      navigate("/");
      toast.success("Login successfully!");
    } catch (error) {
      console.log(error);
      toast.error(
        "Your login credentials don't match an account in our system."
      );
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen max-h-screen bg-gradient-to-br from-gray-200 to-white">
      <div className="flex bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="p-8 flex justify-center items-center">
          <Form {...form}>
            <form
              className="space-y-3 w-full px-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex items-center py-4 gap-3">
                <img src={"RPL.png"} alt="Logo RPL" className="w-[70px]" />
                <div className="flex flex-col text-2xl font-semibold text-logo">
                  <p>RPL</p>
                  <p>Cashier</p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder="Username"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        type="email"
                        placeholder="Email"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder="Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button type="submit" className="w-full bg-logo text-lighter">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
