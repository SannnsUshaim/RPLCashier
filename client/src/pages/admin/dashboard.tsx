import React from "react";
import { fetcher } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Boxes, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Header = {
  _id: string;
  name: string;
  stok: number;
  harga: number;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: products } = useSWR(
    "http://localhost:7700/api/product/",
    fetcher
  );
  const { data: users } = useSWR("http://localhost:7700/api/users", fetcher);

  const { data: user } = useSWR(
    "http://localhost:7700/api/users/current",
    fetcher
  );

  console.log(user);

  const handleProductCardClick = () => {
    navigate("/admin/product");
  };

  const handleUserCardClick = () => {
    navigate("/admin/users");
  };

  return (
    <div className="bg-white h-full w-full rounded-lg shadow-md p-5 overflow-hidden flex flex-col">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <p>Welcome, {user?.username}</p>
        </div>
        <div className="col-span-6">
          <Card
            onClick={handleProductCardClick}
            className="hover:cursor-pointer hover:scale-105 hover:translate-x-3 hover:translate-y-1 hover:bg-primary hover:text-lighter transition"
          >
            <CardHeader>
              <CardTitle>
                <div className="flex gap-3 items-center text-xl font-semibold">
                  <Boxes size={30} />
                  Product
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">
                {products ? products.length : "0"}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6">
          <Card
            onClick={handleUserCardClick}
            className="hover:cursor-pointer hover:scale-105 hover:translate-x-3 hover:translate-y-1 hover:bg-primary hover:text-lighter transition"
          >
            <CardHeader>
              <CardTitle>
                <div className="flex gap-3 items-center text-xl font-semibold">
                  <Users size={30} />
                  Users
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">
                {users ? users.length : "0"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
