import { Boxes, Home, Users } from "lucide-react";

export const NavLinks = [
    {
        label: "Dahsboard",
        base: "/admin",
        department: "admin",
        icon: Home
    },
    {
        label: "Product",
        base: "/admin/product",
        department: "admin",
        icon: Boxes
    },
    {
        label: "Users",
        base: "/admin/users",
        department: "admin",
        icon: Users
    },
    {
        label: "Cashier",
        base: "/cashier",
        department: "cashier",
        icon: Home
    }
]