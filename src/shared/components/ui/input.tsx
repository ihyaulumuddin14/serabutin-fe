import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  error?: string;
};

function Input({ className, type, error, ...props }: InputProps) {
  const [show, setShow] = React.useState(false);
  const isPassword = type === "password";

  const input = (
    <input
      type={isPassword ? (show ? "text" : "password") : type}
      data-slot="input"
      aria-invalid={!!error}
      className={cn(
        "h-10.5 w-full min-w-0 rounded-md border border-input bg-transparent p-3.25 text-sm shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",

        // error state
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",

        // password spacing
        isPassword && "pr-10",

        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        "md:text-sm dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );

  return (
    <div className="w-full space-y-1">
      <div className="relative">
        {input}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute inset-y-0 right-4 flex items-center text-foreground/50 hover:text-foreground focus-visible:text-foreground"
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive text-right">* {error}</p>
      )}
    </div>
  );
}

export { Input };
