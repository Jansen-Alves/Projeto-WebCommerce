import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(2),
      price: vine.number().min(0),
      stocked: vine.number().min(0),
      description: vine.string().trim(),
      subcategoryId: vine.number(),
      categoryId: vine.number().optional(),
      imgSrc: vine.string().optional().nullable(),
    })
  )
  