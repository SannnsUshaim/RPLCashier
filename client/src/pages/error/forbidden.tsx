import { ChevronLeftCircle, ShieldAlert } from 'lucide-react';
import React from 'react'

export const Forbidden = () => {
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
          <div className="flex gap-2 text-red-500 font-semibold items-start">
            <ShieldAlert size={30} />
            <h2 className="text-2xl">403 Forbidden</h2>
          </div>
          <p className="text-lg font-medium">
            You are prohibited from accessing this page. please return to the
            authorized page.
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
}

export default Forbidden