// CheckoutForm.tsx: name, email and address. react-hook-form keeps the values, the errors and
// "submitting"; the Zod schema holds every rule; shadcn's Field draws each input with its
// label and its error under it (slides 49–50).
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../../components/shadcn/field";
import { Input } from "../../../components/shadcn/input";
import { checkoutSchema, type Checkout } from "../checkout.schema";

// One entry per input. The order here is the order on the page.
const FIELDS: { name: keyof Checkout; label: string; type: string; autoComplete: string }[] = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "address", label: "Address", type: "text", autoComplete: "street-address" },
];

interface CheckoutFormProps {
  // Called with the checked values when every rule passes.
  onPlaceOrder: (order: Checkout) => void;
}

export function CheckoutForm({ onPlaceOrder }: CheckoutFormProps) {
  const form = useForm<Checkout>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: "", email: "", address: "" },
    // Check a field when the user leaves it, then on every key: no red on the first letter.
    mode: "onTouched",
  });

  return (
    // noValidate: our messages, not the browser's bubbles. handleSubmit checks the schema
    // first, focuses the first wrong field, and calls onPlaceOrder only when all is valid.
    <form className="checkout-form" noValidate onSubmit={form.handleSubmit(onPlaceOrder)}>
      <FieldGroup>
        {FIELDS.map(({ name, label, type, autoComplete }) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`checkout-${name}`}>{label}</FieldLabel>
                <Input
                  {...field}
                  id={`checkout-${name}`}
                  type={type}
                  autoComplete={autoComplete}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
      </FieldGroup>
      <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
        Place order
      </button>
    </form>
  );
}
