import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  error?: string;
  prefixText?: string;
  nominal?: boolean;
};

const formatNominal = (value: string) => {
  const raw = value.replace(/\D/g, "");
  if (!raw) return { raw: "", display: "" };

  const withSeparators = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return { raw, display: withSeparators };
};

function Input({
  className,
  type,
  error,
  prefixText,
  nominal = false,
  onChange,
  value,
  inputMode,
  defaultValue,
  ...props
}: InputProps) {
  const [show, setShow] = React.useState(false);
  const isPassword = type === "password";
  const hasPrefix = Boolean(prefixText);
  const isControlled = value !== undefined;
  const [internalRaw, setInternalRaw] = React.useState(() =>
    String(defaultValue ?? ""),
  );

  const rawValue = nominal
    ? String(isControlled ? (value ?? "") : internalRaw)
    : String(value ?? internalRaw);
  const displayValue = nominal ? formatNominal(rawValue).display : value;

  const input = (
    <input
      type={isPassword ? (show ? "text" : "password") : type}
      data-slot="input"
      aria-invalid={!!error}
      className={cn(
        "h-10.5 w-full min-w-0 rounded-md border border-input bg-transparent p-3.25 text-sm shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",

        // prefix spacing
        hasPrefix && "pl-12",

        // error state
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",

        // password spacing
        isPassword && "pr-10",

        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        "md:text-sm dark:bg-input/30",
        className,
      )}
      value={nominal ? displayValue : value}
      defaultValue={nominal ? undefined : defaultValue}
      inputMode={nominal ? "numeric" : inputMode}
      onChange={(event) => {
        if (!nominal) {
          onChange?.(event);
          return;
        }

        const { raw } = formatNominal(event.target.value);
        if (!isControlled) {
          setInternalRaw(raw);
        }
        const nextEvent = {
          ...event,
          target: {
            ...event.target,
            value: raw,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange?.(nextEvent);
      }}
      {...props}
    />
  );

  return (
    <div className="w-full space-y-1">
      <div className="relative">
        {hasPrefix && (
          <span className="absolute inset-y-0 left-3 flex items-center text-sm">
            {prefixText}
          </span>
        )}
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
