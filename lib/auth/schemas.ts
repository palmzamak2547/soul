import { z } from "zod";

export const EmailSchema = z.string().trim().email().max(254);
export const PasswordSchema = z
  .string()
  .min(12)
  .max(128)
  .regex(/[a-z]/, "lowercase")
  .regex(/[A-Z]/, "uppercase")
  .regex(/[0-9]/, "number");

export const SignInSchema = z
  .object({ email: EmailSchema, password: z.string().min(1).max(128) })
  .strict();

export const SignUpSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    displayName: z.string().trim().min(2).max(80),
    acceptedPrivacy: z.literal(true),
  })
  .strict();

export const MagicLinkSchema = z
  .object({ email: EmailSchema })
  .strict();
