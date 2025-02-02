const Logo = () => {
  return (
    <div className="flex gap-4 items-center">
      <img src={"/RPL.png"} alt="RPL Logo" className="w-[70px]" />
      <div className="flex flex-col gap-1 font-semibold text-2xl text-lighter">
        <p>RPL</p>
        <p>Cashier</p>
      </div>
    </div>
  );
};

export default Logo;
