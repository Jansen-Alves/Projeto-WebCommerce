import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
      fullname: vine.string().trim().minLength(4),
      email: vine.string().minLength(10),
      password: vine.string().trim().minLength(8),
    
      
    })
  )
  