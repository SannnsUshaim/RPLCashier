import React from "react";
import { SidemenuDropdownLink } from "../ui/sidemenu-dropdown-link";
import { NavLinks } from "@/data/links";
import useAuth from "@/hooks/useAuth";
import Logo from "./logo";

const Sidemenu = () => {
  const { auth } = useAuth();

  const filteredNavLinks = React.useMemo(() => {
    if (!auth || !auth.departments || auth.departments.length === 0) return [];
    return NavLinks.filter((link) =>
      auth.departments.includes(link.department)
    );
  }, [auth]);
  return (
    <div className="basis-2/12 flex flex-col gap-8 bg-primary p-4 h-auto text-white overflow-y-auto shadow-inner">
      <div className="flex items-center gap-5">
        <Logo />
      </div>
      <div className="flex flex-col gap-2">
        {filteredNavLinks.map((link) => (
          <React.Fragment key={link.label}>
            <SidemenuDropdownLink
              Icon={link.icon}
              label={link.label}
              childrens={link.childrens}
              base={link.base}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;
