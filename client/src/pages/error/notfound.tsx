import { ChevronLeftCircle, FileClock } from "lucide-react";
import React from "react";

export const NotFound = () => {
  return (
    <div className="h-screen flex px-16">
      <div className="flex flex-col justify-center items-start gap-6">
        <div className="flex gap-4 items-center">
          <img src={"/RPL.png"} alt="RPL Logo" className="w-[130px]" />
          <div className="flex flex-col gap-1 font-semibold text-4xl text-logo">
            <p>RPL</p>
            <p>Cashier</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 text-dark font-semibold items-start">
            <FileClock size={30} />
            <h2 className="text-2xl">404 Not Found</h2>
          </div>
          <p className="text-lg font-medium">
            The page you're looking for was not found or is under development.
            Sorry for the inconvenience.
          </p>
        </div>
        <a
          href="/"
          className="flex gap-2 capitalize bg-dark rounded-md px-4 py-2 text-lighter font-medium items-center"
        >
          <ChevronLeftCircle size={20} />
          Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
