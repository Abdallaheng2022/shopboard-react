// checkout.schema.ts: every rule of the checkout form, with its message, in one place.
// The form's type comes from these rules, so the two can never disagree (slide 49).
import { z } from "zod";

// The shortest name and address we accept, after trimming spaces.
const MIN_NAME_LENGTH = 2;
const MIN_ADDRESS_LENGTH = 5;

export const checkoutSchema = z.object({
  name: z.string().trim().min(MIN_NAME_LENGTH, "Enter your full name"),
  email: z.email("Enter a valid email, like name@example.com"),
  address: z.string().trim().min(MIN_ADDRESS_LENGTH, "Enter your street, number and city"),
});

export type Checkout = z.infer<typeof checkoutSchema>;
