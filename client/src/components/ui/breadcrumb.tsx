import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  // const navigate = useNavigate();

  return (
    <div className="gap-2 items-center py-2 sm:flex hidden">
      {location.pathname
        .split("/")
        .filter(Boolean)
        .map((path, index, array) => (
          <React.Fragment key={index}>
            {index > 0 && <p>/</p>}
            <Link
              to={`/${array.slice(0, index + 1).join("/")}`}
              className="text-sm last-of-type:font-semibold capitalize"
            >
              {path.replace(/-/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2")}
            </Link>
          </React.Fragment>
        ))}
    </div>
  );
};

export default Breadcrumbs;
