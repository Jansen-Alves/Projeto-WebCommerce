import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(2),
      price: vine.number().min(0),
      stocked: vine.number().min(0),
      imgSrc: vine.string().trim(),
      description: vine.string().trim(),
      category_id: vine.number(),
      subCategory_id: vine.number(),
    })
  )
  