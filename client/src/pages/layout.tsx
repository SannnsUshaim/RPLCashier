import Footer from "@/components/element/footer";
import Sidemenu from "@/components/element/Sidemenu";
import Breadcrumbs from "@/components/ui/breadcrumb";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

const Layout = () => {
  const [expire, setExpire] = React.useState<number>();
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  React.useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:7700/api/auth/token");
      const decoded: (JwtPayload & { department: string[] }) = jwtDecode(
        response.data.accessToken
      );
      setExpire(decoded.exp);
      setAuth((prev) => ({
        ...prev,
        token: response.data.accessToken,
        departments: decoded.department,
      }));
    } catch (error) {
      if (error) {
        navigate("/login");
        toast.error("Error unauthenticated !");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(
          "http://localhost:7700/api/auth/token"
        );
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setAuth((prev) => ({
          ...prev,
          token: response.data.accessToken,
        }));
        const decoded: JwtPayload = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7700/api/auth/logout"
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="h-screen w-full overflow-y-hidden">
      <div className="flex h-full p-0 overflow-y-hidden">
        <Sidemenu />
        <div className="flex flex-col flex-1 h-full px-4 py-4 overflow-hidden">
          <div className="flex-none w-full dark:bg-primary bg-white rounded-lg p-4 shadow-lg flex justify-between items-center mb-4">
            <div className="flex basis-2/4 items-center">
              <Breadcrumbs />
            </div>
            <div className="flex basis-2/4 justify-end items-center gap-5">
              <div className="flex items-center gap-3 text-primary dark:text-white">
                <div className="flex font-medium items-center gap-2 text-red-400">
                  {/* Logout */}
                  <LogOut
                    size={20}
                    className="cursor-pointer"
                    onClick={() => logout()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden mb-3">
            <Outlet />
          </div>
          <div className="flex-none">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
