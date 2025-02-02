import React from "react";
import { Input } from "./input";
import {
  ControllerRenderProps,
  FieldValues,
  useController,
} from "react-hook-form";

interface InputMoneyProps {
  field: ControllerRenderProps<FieldValues>;
  defaultValue?: number;
  className?: string;
  readOnly?: boolean;
}

const InputMoney = ({
  field,
  className,
  defaultValue,
  readOnly,
}: InputMoneyProps) => {
  return (
    <Input
      disabled={readOnly}
      className={className}
      defaultValue={
        defaultValue &&
        defaultValue.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
      }
      onBlur={(e) => {
        e.target.value = field.value.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        });
      }}
      onFocus={(e) => {
        e.target.value = field.value.toString();
      }}
      onChange={(e) => {
        const valueAsNumber = Number(e.target.value);
        if (isNaN(valueAsNumber)) {
          e.preventDefault();
          return;
        }
        field.onChange(valueAsNumber);
      }}
      placeholder="Rp 0,00"
    />
  );
};

export default InputMoney;
