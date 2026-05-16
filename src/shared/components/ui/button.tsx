import { Icon } from "@iconify/react";
import { type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { buttonVariants } from "@/shared/helper/buttonVariant";
import { cn } from "../../lib/utils";

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={isLoading || disabled}
      className={cn(
        buttonVariants({ variant, size }),
        "inline-flex items-center justify-center gap-2 text-xs sm:text-sm",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Icon
          icon="eos-icons:loading"
          width="2em"
          height="2em"
          className="animate-spin"
          style={{ color: "#fff" }}
        />
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button };

