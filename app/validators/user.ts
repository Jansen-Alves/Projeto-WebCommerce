import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
      fullName: vine.string().trim().minLength(4),
      email: vine.string().email().trim(),
      birthday: vine.date({
        formats: ['yyyy-mm-dd','aaaa-mm-dd', 'dd-mm-aaaa', 'YYYY/MM/DD','DD/MM/YYYY', 'dd/mm/yyyy', 'dd/mm/aaaa','YYYY-MM-DD']
      }),
      password: vine.string().minLength(5).confirmed(),
    
    
      
    })
  )
  