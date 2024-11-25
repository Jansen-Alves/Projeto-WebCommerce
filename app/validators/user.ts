import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
      fullName: vine.string().trim().minLength(4),
      email: vine.string().email().trim(),
      cpf: vine.string(),
      birthday: vine.date({
        formats: ['yyyy-mm-dd','aaaa-mm-dd', 'dd-mm-aaaa', 'YYYY/MM/DD','DD/MM/YYYY', 'dd/mm/yyyy', 'dd/mm/aaaa','YYYY-MM-DD']
      }),
      password: vine.string().minLength(8) // Mínimo de 8 caracteres
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^]).+$/) // Regras para maiúsculas, minúsculas, números e símbolos
      .confirmed(),
      
    })
  )
  