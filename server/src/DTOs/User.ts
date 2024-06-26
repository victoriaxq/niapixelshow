import { z } from 'zod';

export const User = z.object({
  name: z
    .string({ message: 'O nome não pode ser vazio' })
    .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/, { message: 'O nome deve conter apenas letras' }),
  phone: z
    .string()
    .regex(/^\+?[0-9]+$/, {
      message: 'O número de telefone deve conter apenas números',
    })
    .optional(),
  email: z.string({ message: 'O email não pode ser vazio' }).email({ message: 'Endereço de email inválido' }),
  password: z
    .string({ message: 'A senha não pode ser vazia' })
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  address: z.string().optional(),
  is_admin: z.boolean().default(false),
});

export const UpdateUser = User.partial();