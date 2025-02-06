// src/components/BarcodeGenerator.tsx
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeGeneratorProps {
  productId: string;
}

export const BarcodeGenerator = ({ productId }: BarcodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && productId.length === 12) {
      JsBarcode(canvasRef.current, productId, {
        format: "CODE128",
        displayValue: true,
        fontSize: 16,
      });
    }
  }, [productId]);

  return productId.length === 12 ? (
    <canvas ref={canvasRef} />
  ) : (
    <div className="text-red-500">Product ID must be exactly 12 digits!</div>
  );
};
