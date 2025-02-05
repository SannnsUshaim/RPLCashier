import Logo from "@/components/element/logo";
import React from "react";
import { useLocation } from "react-router-dom";

interface TransactionData {
  products: Array<{
    nama: string;
    harga: number;
    quantity: number;
  }>;
  totalBarang: number;
  totalHarga: number;
  bayar: number;
  kembalian: number;
  waktuTransaksi: string;
}

export const Print = () => {
  const location = useLocation();
  const transactionData = location.state as TransactionData;

  React.useEffect(() => {
    if (transactionData) {
      window.print();
      setTimeout(() => window.close(), 1000); // Opsional: tutup window setelah print
    }
  }, []);

  if (!transactionData) return <div>No data to print</div>;

  return (
    <div className="p-8 font-mono">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex gap-2 mb-2">
          <img src={"/RPL.png"} alt="RPL logo" className="w-[70px]" />
          <div className="flex flex-col justify-center text-lg font-semibold text-logo">
            <p>RPL</p>
            <p>Cashier</p>
          </div>
        </div>
        <h1 className="font-semibold text-lg">Struk Belanja</h1>
        <div>
          Tanggal: {new Date(transactionData.waktuTransaksi).toLocaleString()}
        </div>
      </div>

      <div className="border-b-2 mb-4">
        {transactionData.products.map((product, index) => (
          <div key={index} className="mb-2 flex flex-col gap-1">
            <div className="flex justify-between font-medium">
              <span>{product.nama}</span>
              <span>Rp.{product.harga.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>{product.quantity} x</span>
              <span>
                Rp.{(product.harga * product.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="grid grid-cols-12 gap-1 font-medium">
          <div className="col-span-4">
            <span>Total Barang</span>
          </div>
          <div className="col-span-2">
            <span>:</span>
          </div>
          <div className="col-span-6 flex justify-end">
            <span>{transactionData.totalBarang.toLocaleString()}</span>
          </div>
          <div className="col-span-4">
            <span>Total Harga</span>
          </div>
          <div className="col-span-2">
            <span>:</span>
          </div>
          <div className="col-span-6 flex justify-end">
            <span>Rp.{transactionData.totalHarga.toLocaleString()}</span>
          </div>
          <div className="col-span-4">
            <span>Bayar</span>
          </div>
          <div className="col-span-2">
            <span>:</span>
          </div>
          <div className="col-span-6 flex justify-end">
            <span>Rp.{transactionData.bayar.toLocaleString()}</span>
          </div>
          <div className="col-span-4">
            <span>kembalian</span>
          </div>
          <div className="col-span-2">
            <span>:</span>
          </div>
          <div className="col-span-6 flex justify-end">
            <span>Rp.{transactionData.kembalian.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className=" mt-8">Terima kasih atas kunjungan Anda!</div>
      <div className="text-sm font-semibold mt-1">#Coding4Fun</div>
    </div>
  );
};

export default Print;
