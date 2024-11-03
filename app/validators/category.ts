import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(2),
      
    })
  )
  