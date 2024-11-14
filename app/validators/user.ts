import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
      fullName: vine.string().trim().minLength(4),
      email: vine.string().email().trim(),
      birthday: vine.date({
        formats: [  'YYYY-MM-DD']
      }),
      password: vine.string().minLength(5).confirmed(),
    
    
      
    })
  )
  