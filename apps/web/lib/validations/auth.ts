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
});

export const registerSchema = registerSchemaBase
  .extend({
    confirmPassword: z.string().min(1, "confirm_pwd"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "pwd_dont_match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterBackendData = z.infer<typeof registerSchemaBase>;
