import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedPath = ({
  allowedDepartments,
}: {
  allowedDepartments: string;
}) => {
  const {auth} = useAuth()

  if (!auth || !auth.token) {
    return null;
  }

  return auth?.departments.some(
    (department: string) => allowedDepartments === department
  ) ? (
    <Outlet />
  ) : auth?.token ? (
    <Navigate to={"/403-forbidden"} replace />
  ) : (
    <Navigate to={"*"} replace />
  );
};

export default ProtectedPath;
