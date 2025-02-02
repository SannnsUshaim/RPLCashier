import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: "default" | "primary" | "danger";
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default:
      "border-zinc-900 focus-visible:ring-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-zinc-50 dark:border-zinc-800 dark:border-zinc-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900",
    primary:
      "text-primary border-zinc-900 focus-visible:ring-zinc-950 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-zinc-50 dark:border-zinc-800 dark:border-zinc-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900",
    danger:
      "text-red-500 border-zinc-900 focus-visible:ring-zinc-950 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-zinc-50 dark:border-zinc-800 dark:border-zinc-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900",
  };
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        variants[variant],
        "peer h-4 w-4 shrink-0 rounded-sm border border-dark shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-dark data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
