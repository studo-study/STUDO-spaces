import { z } from "zod";

export const registerSchemaBase = z.object({
  email: z.string().min(1, "email_required").email("faulty_email"),
  password: z
    .string()
    .min(8, "pwd_min_8")
    .regex(/[A-Z]/, "min_1_capital")
    .regex(/[0-9]/, "min_1_number"),
  displayName: z.string().min(2, "name_2_char_min").max(50, "name_50_char_max"),
  role: z.enum(["student", "teacher", "professor"]),
  // Door de registratie in te dienen gaat de gebruiker akkoord met de
  // voorwaarden; de hook vult deze aan. Optioneel zodat het formulier ze niet
  // vereist en de route ze niet wegstript.
  acceptedTerms: z.boolean().optional(),
  acceptedTermsDate: z.string().optional(),
  privacyVersion: z.string().optional(),
});

export const registerSchema = registerSchemaBase
  .extend({
    confirmPassword: z.string().min(1, "confirm_pwd"),
    // In het formulier verplicht: aanvinken vóór registreren. De leeftijdseis
    // staat in de gebruiksvoorwaarden zelf (Quizlet-aanpak).
    acceptedTerms: z.boolean().refine((v) => v, { message: "accept_terms" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "pwd_dont_match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.input<typeof registerSchema>;
export type RegisterBackendData = z.infer<typeof registerSchemaBase>;
