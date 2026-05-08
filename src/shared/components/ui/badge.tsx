import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { badgeVariants } from "@/shared/helper/badgeVariants";
import { cn } from "@/shared/lib/utils";

function Badge({
  className,
  variant = "default",
  asChild = false,
  withDot = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    withDot?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), "text-[10px] sm:text-xs h-fit gap-0",  className)}
      {...props}
    >
      {withDot && <span className="text-lg mr-1 -mt-0.5">•</span>}
      {props.children}
    </Comp>
  );
}

export { Badge };
